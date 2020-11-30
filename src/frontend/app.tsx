import React from 'react'
import { QuoteForm } from "./quote-form"

export const App = React.memo(() => {
  return <>
    <div className="container mx-auto pb-40 px-6">
      <div className="flex flex-wrap">
        <div className="flex-grow">
          <QuoteForm />
        </div>
      </div>
    </div>
  </>
})
