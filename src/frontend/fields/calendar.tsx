import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import isValid from "date-fns/isValid"
import parseISO from "date-fns/parseISO"
import { ValidationError } from "../errors"
import { Errors } from "./errors"
import { ERROR_CLASSNAME, INPUT_CLASSNAME } from "./_design"

export interface Props {
  value?: any;
  label?: string;
  helpText?: string;
  placeholder?: string;
  errors?: ValidationError[];
  required?: boolean;

  onChange?(value: any): any;
}

export const Calendar = (props: Props) => {
  const { helpText, placeholder, onChange, label, errors } = props

  const convertISOToUS = (date) => {
    if (date instanceof Date) return date
    date = parseISO(props.value) || props.value
    date = isValid(date) ? date : props.value
    return date
  }

  const [value, setValue] = useState(convertISOToUS(props.value))
  useEffect(() => {
    setValue(convertISOToUS(props.value))
  }, [props.value])

  let className = errors?.length ? ERROR_CLASSNAME : INPUT_CLASSNAME

  return (
    <div className="mb-4">
      <label>{label}</label>
      <DatePicker
        selected={value || null}
        onChange={date => onChange(date)}
        className={className}
        placeholderText={placeholder}
      />
      {helpText && <small className="block mt-1 text-gray-600">{helpText}</small>}
      <Errors errors={errors} />
    </div>
  )
}
