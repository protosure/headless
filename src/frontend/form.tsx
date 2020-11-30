import React, { useState } from "react"
import { set } from 'object-path-immutable'

import { Option, Select } from "./fields/select"
import { Input } from "./fields/input"
import { Calendar } from "./fields/calendar"
import { FormSet } from "./fields/formset"
import { DataSheet } from "./fields/datasheet"
import { AdditionalLocation, Quote, QuoteInputData } from "./interfaces"
import { QuoteInputDataErrors, ValidationError } from "./errors"
import { Errors } from "./fields/errors"

const USDCurrencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const STATES_OPTIONS: Option[] = [
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
]


type Props = {
  errors: QuoteInputDataErrors
  disabled?: boolean
  onChange: (data: QuoteInputData) => any
  quote: Quote
}

export const Form = (props: Props) => {
  const { disabled, onChange, errors, quote } = props

  const [data, setData] = useState<QuoteInputData>(quote.inputData)

  const setValue = (path: keyof QuoteInputData | string, value: any) => {
    let inputData = set(data, path, value)
    setData(inputData)
    onChange(inputData)
  }

  return (
    <>
      <div>&nbsp;</div>
      <h1>Policy Form</h1>
      <h3 className="mt-4">Insured Information</h3>
      <div className="flex -mx-2">
        <div className="w-1/4 px-2">
          <Select
            label="Principal Insured Type"
            errors={errors.principalInsuredType as ValidationError[]}
            onChange={(value) => setValue("principalInsuredType", value)}
            value={data.principalInsuredType}
            options={[
              { label: "Person", value: "Person" },
              { label: "Trust", value: "Trust" },
              { label: "LLC", value: "LLC" },
            ]}
          />
        </div>

        {data.principalInsuredType === 'Person' && (<>
          <div className="w-3/4 px-2">
            <div className="flex -mx-2">
              <div className="w-1/6 px-2">
                <Select
                  label="Prefix"
                  errors={errors.prefix as ValidationError[]}
                  onChange={(value) => setValue("prefix", value)}
                  value={data.prefix}
                  options={[
                    { label: "Mr.", value: "Mr." },
                    { label: "Mrs.", value: "Mrs." },
                    { label: "Miss.", value: "Miss." },
                    { label: "Ms.", value: "Ms." },
                    { label: "Dr.", value: "Dr." },
                    { label: "Rabbi", value: "Rabbi" },
                  ]}
                />
              </div>
              <div className="w-1/3 px-2">
                <Input
                  label="First Name"
                  errors={errors.firstName as ValidationError[]}
                  onChange={(value) => setValue("firstName", value)}
                  value={data.firstName}
                />
              </div>
              <div className="w-1/6 px-2">
                <Input
                  label="Middle Name"
                  errors={errors.middleName as ValidationError[]}
                  onChange={(value) => setValue("middleName", value)}
                  value={data.middleName}
                />
              </div>
              <div className="w-1/3 px-2">
                <Input
                  label="Last Name"
                  errors={errors.lastName as ValidationError[]}
                  onChange={(value) => setValue("lastName", value)}
                  value={data.lastName}
                />
              </div>
            </div>
            <div className="flex -mx-2">
              <div className="w-1/3 px-2">
                <Calendar
                  label="Birth Date"
                  errors={errors.birthDate as ValidationError[]}
                  onChange={(value) => setValue("birthDate", value)}
                  value={data.birthDate}
                  placeholder="mm/dd/yyyy"
                />
              </div>
              <div className="w-1/3 px-2">
                <Select
                  label="Marital Status"
                  errors={errors.maritalStatus as ValidationError[]}
                  onChange={(value) => setValue("maritalStatus", value)}
                  value={data.maritalStatus}
                  options={[
                    { label: "Single", value: "Single" },
                    { label: "Married", value: "Married" },
                    { label: "Divorced", value: "Divorced" },
                    { label: "Fiance or Fiancee", value: "Fiance or Fiancee" },
                    { label: "Separated", value: "Separated" },
                  ]}
                />
              </div>
              <div className="w-1/3 px-2">
                <Input
                  label="Email Address"
                  errors={errors.emailAddress as ValidationError[]}
                  onChange={(value) => setValue("emailAddress", value)}
                  value={data.emailAddress}
                />
              </div>
            </div>
          </div>
        </>)}
        {(data.principalInsuredType === 'Trust' || data.principalInsuredType === 'LLC') && (<>
          <div className="w-3/4 px-2">
            <div className="flex -mx-2">
              <div className="w-1/4 px-2">
                <Input
                  label="Entity Name"
                  errors={errors.entityName as ValidationError[]}
                  onChange={(value) => setValue("entityName", value)}
                  value={data.entityName}
                />
              </div>
            </div>
          </div>
        </>)}
      </div>
      <hr className='my-8'/>
      <div className="flex -mx-8">
        <div className="w-1/2 px-8">
          <h3>Insured Location</h3>
          <Input
            label="Street Line 1"
            errors={errors.insuredLocation?.street1 as ValidationError[]}
            onChange={(value) => setValue("insuredLocation.street1", value)}
            value={(data.insuredLocation || {}).street1}
          />
          <Input
            label="Street Line 2"
            errors={errors.insuredLocation?.street2 as ValidationError[]}
            onChange={(value) => setValue("insuredLocation.street2", value)}
            value={(data.insuredLocation || {}).street2}
          />
          <Input
            label="City"
            errors={errors.insuredLocation?.city as ValidationError[]}
            onChange={(value) => setValue("insuredLocation.city", value)}
            value={(data.insuredLocation || {}).city}
          />
          <Select
            label="State"
            errors={errors.insuredLocation?.state as ValidationError[]}
            onChange={(value) => setValue("insuredLocation.state", value)}
            value={(data.insuredLocation || {}).state}
            options={STATES_OPTIONS}
          />
          <Input
            label="Zip"
            errors={errors.insuredLocation?.zip as ValidationError[]}
            onChange={(value) => setValue("insuredLocation.zip", value)}
            value={(data.insuredLocation || {}).zip}
          />
        </div>

        <div className="w-1/2 px-8">
          <h3>Coverage</h3>
          <Input
            label="Coverage A"
            errors={errors.coverageA as ValidationError[]}
            onChange={(value) => setValue("coverageA", value)}
            value={data.coverageA}
          />
          <Input
            label="Coverage B"
            errors={errors.coverageB as ValidationError[]}
            onChange={(value) => setValue("coverageB", value)}
            value={data.coverageB}
          />

          <Input
            label="Coverage C"
            errors={errors.coverageC as ValidationError[]}
            onChange={(value) => setValue("coverageC", value)}
            value={data.coverageC}
          />
          <Input
            label="Coverage D"
            errors={errors.coverageD as ValidationError[]}
            onChange={(value) => setValue("coverageD", value)}
            value={data.coverageD}
          />
          <b>Total Coverage:</b><br />
          <div className="mt-2">
            {USDCurrencyFormat.format(quote.calculatedData.totalCoverage || 0).replace(/\.00$/, '')}

          </div>
        </div>
      </div>

      <hr className='my-8'/>

      <div className="flex -mx-8">
        <div className="w-1/2 mx-8">
          <h3>Additional Locations</h3>
          <FormSet<AdditionalLocation>
            value={data.additionalLocations}
            singularName="Location"
            pluralName="Locations"
            errors={errors.additionalLocations as unknown as Record<string, ValidationError[]>[]}
            onChange={(value) => setValue('additionalLocations', value)}
            disabled={disabled}
            createNewValue={() => ({ coverage: '', address: '' })}
          >
            {({ item, onChange, itemErrors, disabled, index }) => {
              return (
                <>
                  <div className="flex -mx-2 w-full">
                    <div className="w-3/4 mx-2">
                      <Input
                        label="Address"
                        value={item.address}
                        onChange={(value) => onChange(index, 'address', value)}
                        readOnly={disabled}
                        errors={itemErrors.address}
                      />
                    </div>
                    <div className="w-1/4 mx-2">
                      <Input
                        label="Coverage"
                        value={item.coverage}
                        onChange={(value) => onChange(index, 'coverage', value)}
                        readOnly={disabled}
                        errors={itemErrors.coverage}
                        type='number'
                      />
                    </div>
                  </div>
                </>
              )
            }}
          </FormSet>

        </div>
        <div className="w-1/2 mx-8">
          <h3>Personal Articles</h3>
          <DataSheet
            columns={[
              { key: 'description', header: 'Description' },
              { key: 'coverage', header: 'Coverage', width: '20%' }]}
            onChange={(value => setValue('personalArticles', value))}
            value={data.personalArticles}
            errors={errors.personalArticles as unknown as Array<Record<any, ValidationError[]>>}
          />
        </div>
      </div>

      <Errors errors={errors.formErrors} />
    </>
  )
}
