import React, { useMemo } from 'react'
import { ValidationError } from "../errors"
import { Errors } from "./errors"
import { ERROR_CLASSNAME, INPUT_CLASSNAME } from "./_design"

export type Option = { label: string; value: any }

export interface Props {
  value?: any;
  options: Array<Option>;
  disabled?: boolean
  label?: string;
  helpText?: string;
  placeholder?: string;
  errors?: ValidationError[];
  required?: boolean;

  onChange?(value: any): any;
}

export const Select = (props: Props) => {
  const { helpText, placeholder, onChange, value, options, label, disabled, errors = [] } = props
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)
  const optionsWithEmpty = useMemo(() => [{ label: '', value: '' }, ...options], [options])

  const borderColor = errors.length ? 'red' : 'gray'

  let className = errors?.length ? ERROR_CLASSNAME : INPUT_CLASSNAME
  className = 'focus:outline-none focus:shadow-outline  pr-8 leading-tight ' + className

  className += disabled ? ' bg-gray-200' : 'bg-white'

  return (
    <div className="mb-4">
      <label>{label}</label>
      <div className="inline-block relative w-full">
        <select
          style={{ height: '42px' }} // Select adjustment for tailwind
          className={className}
          id="exampleFormControlSelect2"
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          value={value || ''}
        >
          {optionsWithEmpty.map((o, i) => (
            <option key={i} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-${borderColor}-700`}>
          <svg className={`fill-current h-4 w-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      {helpText && <small className="block mt-1 text-gray-600">{helpText}</small>}
      <Errors errors={errors} />
    </div>
  )
}
