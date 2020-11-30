import React, { useEffect, useRef, useState } from "react"
import { Form } from "./form"
import { QuoteUrls } from "./quote-urls"
import { convertErrorsArrayToDict, QuoteInputDataErrors } from "./errors"
import { Quote } from "./interfaces"

const API_HOST = process.env.API_HOST
const TENANT_ID = process.env.TENANT_ID //'f2571903-0661-4d12-aa58-0033a5cd95da'

const req = (method, url, data?) => fetch(url, {
  cache: 'no-cache',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  method,
  body: JSON.stringify(data)
})

const createNewQuote = () => {
  localStorage.removeItem('quoteId')
  window.location.reload()
}

export const QuoteForm = () => {
  const quoteId = localStorage.getItem('quoteId')

  const urls = useRef(new QuoteUrls(API_HOST, TENANT_ID)).current
  const [quote, setQuote] = useState<Quote | null>(null)
  const [policy, setPolicy] = useState<Record<any, any> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [calculating, setCalculating] = useState<boolean>(false)

  const updatePolicy = async () => {
    const policy = await (await req('GET', urls.policyUrl)).json()
    setPolicy(policy)
  }
  // Load quote
  useEffect(() => {
    (async () => {
      setLoading(true)
      let fetchedQuote
      if (!quoteId) {
        fetchedQuote = await (await req('POST', urls.getOrCreateQuoteUrl)).json()
        urls.quoteId = fetchedQuote.id
        localStorage.setItem('quoteId', fetchedQuote.id)
      } else {
        urls.quoteId = quoteId
        const response = await req('GET', urls.quoteUrl)
        if (response.status === 404) {
          createNewQuote()
        }
        fetchedQuote = await response.json()
      }
      setLoading(false)
      setQuote(fetchedQuote)
      urls.policyId = fetchedQuote.policy
      updatePolicy()
    })()
  }, [])

  const [errors, setErrors] = useState<QuoteInputDataErrors>({})

  const handleChange = async (inputData: any): Promise<any> => {
    setQuote({
      ...quote,
      raterData: {}
    })

    // Temporary set county manually
    inputData = {
      ...inputData,
      insuredLocation: {
        ...inputData.insuredLocation,
        countyName: "New York County",
        countyFips: "36061",
      }
    }

    const response = await req('PATCH', urls.updateQuoteInputDataUrl, { inputData })
    const updatedQuote = await response.json()
    setQuote((currentQuote) => ({
      ...currentQuote,
      calculatedData: updatedQuote.calculatedData
    }))
  }

  const handleCalculateClick = async () => {
    setErrors({})
    setCalculating(true)

    // api caches rater data if quote hasn't changed
    // to retrigger calculation even quote not changed we send force: true
    const response = await req('POST', urls.calculateUrl, { force: true })
    const data = await response.json()
    if (response.status === 400) {
      setErrors(convertErrorsArrayToDict(data.quoteErrors))
      setCalculating(false)
      return
    }

    setQuote({ ...quote, raterData: data.raterData })
    setCalculating(false)
  }

  const handleSubmitClick = async () => {
    const resp = await req('GET', urls.quoteErrorsUrl)
    const data = await resp.json()
    const quoteErrors = data.quoteErrors
    const errorsDict = convertErrorsArrayToDict(quoteErrors)
    setErrors(errorsDict)
    if (quoteErrors.some(err => err.blocker)) {
      setCalculating(false)
      return
    }
    const submitResp = await (await req('POST', urls.submitUrl)).json()
    if (!submitResp.success) throw new Error(submitResp)
    updatePolicy()
  }

  //////////////////////////////////////////

  if (loading) return <div className='text-center mt-20 text-gray-700'>Loading....</div>
  if (!quote || !policy) return null

  urls.quoteId = quote.id
  urls.policyId = quote.policy

  return <>
    <Form
      quote={quote}
      onChange={handleChange}
      errors={errors}
      disabled={policy.status === 'SUBMITTED'}
    />

    {quote.raterData?.premium && (
      <div className='flex bg-gray-200 justify-center items-center h-16 p-4 my-6  rounded-lg'>
        <h3>Premium: ${quote.raterData.premium}</h3>
      </div>
    )}
    {policy.status !== 'SUBMITTED' ? (
      <div className='flex bg-gray-200 justify-center items-center h-16 p-4 my-6  rounded-lg'>
        {
          quote.raterData?.premium === undefined
            ? <ActionButton disabled={calculating} onClick={handleCalculateClick}>
              {calculating ? 'Calculating...' : 'Calculate'}
            </ActionButton>
            : <ActionButton onClick={handleSubmitClick}>Submit</ActionButton>
        }
      </div>
    ) : (
      <div>
        <div className='flex bg-green-200 justify-center items-center h-16 p-4 my-6  rounded-lg'>
          Policy Submitted
        </div>
        <div className="text-center">
          <button
            className='select-none py-2 px-4 rounded text-gray border hover:bg-gray-100'
            onClick={createNewQuote}
          >
            New Quote
          </button>
        </div>
      </div>
    )}
  </>
}


function ActionButton({ disabled, children, onClick }: { disabled?: boolean, onClick?: any, children: any }) {
  const bg = disabled ? 'bg-blue-400' : 'bg-blue-700'

  return (
    <button className={`py-2 px-4 rounded text-white ${bg}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
