import React, { useCallback, useEffect, useState } from "react"
import { Errors } from "./errors"
import { useDebouncedCallback } from "use-debounce"
import { ValidationError } from "../errors"
import { ERROR_CLASSNAME, INPUT_CLASSNAME } from "./_design"

export interface Props {
  value?: any;
  label?: string;
  helpText?: string;
  placeholder?: string;
  errors?: ValidationError[];
  required?: boolean;
  type?: "number" | "text" | "password" | "email";
  readOnly?: boolean

  onChange?(value: any): any;
}

export const Input = (props: Props) => {
  const { helpText, placeholder, type, onChange, value: propsValue, label, readOnly, errors } = props

  const [value, setValue] = useState(propsValue)
  useEffect(() => setValue(propsValue), [propsValue])

  const { pending, callback: propsOnChangeDebounced } = useDebouncedCallback(onChange, 500)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    propsOnChangeDebounced(e.target.value)
  }, [value])

  let className = errors?.length ? ERROR_CLASSNAME : INPUT_CLASSNAME
  if (pending()) className += ' pr-8'

  return (
    <div className="mb-4">
      <label>{label}</label>
      <div className='inline-block relative w-full'>
        <input
          type={type}
          className={className}
          placeholder={placeholder}
          onChange={handleChange}
          value={value || ''}
          readOnly={readOnly}
        />
        {pending() && (
          <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700`}>
            <div className="la-ball-clip-rotate la-dark la-sm" style={{ marginRight: '3px' }}>
              <div></div>
            </div>
          </div>
        )}
      </div>
      {helpText && <small className="block mt-1 text-gray-600">{helpText}</small>}

      <Errors errors={errors} />
    </div>
  )
}
