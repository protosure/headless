import React from 'react'
import { ValidationError } from "../errors"

interface Props {
  errors?: ValidationError[]
}

export const Errors = (props: Props) => {
  const { errors } = props
  if (!errors?.length) return null
  return (
    <div>
      {errors.map((err, i) => <div
        className='text-red-700 text-sm'
        key={i}
        style={{ color: err.color }}
      >{err.message}</div>)}
    </div>
  )
}
