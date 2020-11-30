import { push } from "object-path-immutable"
import { QuoteInputData } from "./interfaces"

export type ValidationError = {
  message: string
  blocker: boolean
  showPublicUser: boolean
  path?: string
  color?: string
  icon?: string
  publicUserErrorMessage?: string
}

export type FieldErrors =
// "Normal" fields have just a list validation errors
  | ValidationError[]
  // Address & similar fields have a list of validation errors for each subfield
  | Record<string, ValidationError[] | QuoteErrors[]>

type QuoteErrors<T extends string = string> = Record<T, FieldErrors>


export type QuoteInputDataErrors = Partial<QuoteErrors<keyof QuoteInputData>
  & { insuredLocation?: Record<any, Array<ValidationError>> }
  & { formErrors: ValidationError[] }>

export const convertErrorsArrayToDict = (errors: ValidationError[]): QuoteInputDataErrors => {
  const quoteErrors: QuoteInputDataErrors = errors
    .filter((error) => error.path)
    .reduce((result, error) => push(result, error.path, error), {})

  // Errors without path
  // We display them under the inputs near the Calculate/Submit buttons
  const nonFieldErrors = errors.filter((error) => !error.path)
  if (nonFieldErrors.length) {
    return {
      ...quoteErrors,
      'formErrors': nonFieldErrors,
    }
  }
  return quoteErrors
}
