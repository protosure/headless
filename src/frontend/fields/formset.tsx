import React, { useState } from 'react'
import { ValidationError } from "../errors"
// import './Formset.scss'
type Dict<T = any> = Record<string, T>

export interface FormsetItemParams<T> {
  item: T
  index: number
  itemErrors: Dict<ValidationError[]>
  disabled?: boolean
  onChange: (index: number, key: keyof T, value: any) => any
}

interface Props<T> {
  label?: string
  singularName: string
  pluralName: string
  errors?: Array<Dict<ValidationError[]>>
  showRowCaption?: boolean
  helpText?: string
  required?: boolean
  disabled?: boolean
  value?: T[]
  children: (params: FormsetItemParams<T>) => React.ReactElement
  createNewValue: () => T
  onChange?: (data: T[]) => any
}

export const FormSet = <T extends Dict>(props: Props<T>) => {
  // prettier-ignore
  const {
    pluralName, label, singularName, value = [], onChange, children, showRowCaption, errors, disabled, createNewValue,
  } = props
  const [indexToDelete, setIndexToDelete] = useState<number>()
  const addRow = React.useCallback(() => {
    onChange?.([...value, createNewValue()])
  }, [onChange, value, createNewValue])
  const deleteRow = React.useCallback(
    (index) => {
      onChange?.(value.filter((item, i) => i !== index))
    },
    [onChange, value]
  )
  const handleItemChange = React.useCallback(
    (index: number, key: string, keyValue: any) => {
      const changedValue = value.map((item, i) => {
        if (i !== index) return item
        return {
          ...item,
          [key]: keyValue,
        }
      })
      onChange?.(changedValue)
    },
    [onChange, value]
  )
  return (
    <div className="formset">
      {label && <label>{label}</label>}
      {value.length === 0 && (
        <div className="py-2 text-gray-600">
          No {pluralName} Added
        </div>
      )}


      {value.map((item, i) => {
        let rowClass = 'formset-row flex pt-2 pl-3 pb-3 ml-n3 rounded'
        if (i === indexToDelete) rowClass += ' delete-highlight'
        return (
          <div className={rowClass} key={i}>
            <div key={item.id} style={{ width: '100%' }}>
              {showRowCaption && <span>{singularName} #{i}</span>}
              {children({ item, onChange: handleItemChange, index: i, itemErrors: errors?.[i] || {}, disabled })}
            </div>
            {!disabled && (
              <div className="pl-2 pr-2">
                <a
                  className='text-red-600 hover:text-red-600 hover:bg-red-200 cursor-pointer font-bold font-normal whitespace-no-wrap py-1 px-2 rounded no-underline hover:no-underline '
                  onClick={() => confirm('Delete?') && deleteRow(i)}
                  tabIndex={-1}
                  onMouseOver={() => setIndexToDelete(i)}
                  onMouseOut={() => setIndexToDelete(undefined)}
                >
                  &times;
                </a>
              </div>
            )}
          </div>
        )
      })}
      {!disabled && (
        <div className="mt-4">
          <button
            className='select-none border py px-2 rounded text-white bg-green-500 hover:bg-green-400'
            onClick={addRow}
          >
            <b>+</b> Add {singularName}
          </button>
        </div>
      )}
    </div>
  )
}
