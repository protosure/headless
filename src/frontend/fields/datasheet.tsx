import React, { useCallback, useMemo } from "react"
import ReactDataSheet from "react-datasheet"
import 'react-datasheet/lib/react-datasheet.css'
import { set } from "object-path-immutable"
import { Errors } from './errors'
import { ValidationError } from "../errors"

export interface Props {
  value?: any;
  columns: Array<{
    width?: any
    header: string, key: string
  }>
  label?: string;
  helpText?: string;
  placeholder?: string;
  errors?: Array<Record<any, ValidationError[]>>;
  required?: boolean;
  type?: "number" | "text" | "password" | "email";

  onChange?(value: any): any;
}

export const DataSheet = (props: Props) => {
  const { helpText, onChange, value = [], label, columns, errors = [] } = props
  const DELETE_COL_WIDTH = '70px'

  let headers = useMemo(() => [
    ...columns.map(c => ({ value: c.header, readOnly: true, width: c.width })),
    { readOnly: true, width: DELETE_COL_WIDTH } // header for buttons row

  ], [columns])
  const deleteRow = (deleteIndex) => onChange(value.filter((_, i) => i !== deleteIndex))
  // we reload emptyRow on value since we need a new instance every time row was added/deleted
  const emptyRow = useMemo(() => columns.reduce((acc, col) => ({ ...acc, [col.key]: '' })), [columns, value.length])
  const valuesWithEmptyRow = useMemo(() => [...(value || []), emptyRow], [value, emptyRow])


  let grid = [
    headers,
    ...valuesWithEmptyRow.map((row, i) => [
      ...(columns.map(c => ({ value: row[c.key] || '', width: c.width }))),
      {
        forceComponent: true,
        width: DELETE_COL_WIDTH,
        className: 'text-center',
        readOnly: true,
        component: i !== valuesWithEmptyRow.length - 1
          ? (
            <button
              className='text-center font-normal py-1 px-2 rounded text-xs text-white bg-red-600 hover:bg-red-500 '
              onClick={() => deleteRow(i)}
            >
              Delete
            </button>
          )
          : undefined
      }
    ]) as any
  ]

  let handleCellChanged = changes => {
    let newValue = value
    changes.forEach(change => {
      const columnIndex = columns.map(c => c.key)[change.col]
      newValue = set(newValue, [change.row - 1, columnIndex,], change.value)
    })
    onChange(newValue)
  }
  // We have to keep empty cell span instance here
  // because new instance of span will cause valueRenderer to retrigger infinte loop in datasheer's DataCell
  const emptyCell = <span>&nbsp;</span>

  return (
    <div className="mb-4">
      <label>{label}</label>
      {helpText && <small className="block mt-1 text-gray-600">{helpText}</small>}
      <ReactDataSheet
        data={grid}
        //  Types are broken so (cell as any)
        // ' ' is non-breaking space https://www.compart.com/en/unicode/U+00A0
        valueRenderer={useCallback((cell) => (cell as any).value || emptyCell, [])}
        dataRenderer={(cell) => (cell as any).value}
        onCellsChanged={handleCellChanged}
      />
      {errors.map((errRow, i) => {
        const _errors: string[] = Object
          .entries(errRow)
          .map(([key, errors]) => {
            const header = columns.filter(c => c.key === key)[0].header
            return `Row ${i+1}, column ${header}: ${errors.map(e => e.message).join(',')}`
          })
        return <div key={i}>
          {_errors.map((err, i) => <div className='text-red-700 text-sm' key={i}>{err}</div>)}
        </div>
      })}
    </div>
  )
}
