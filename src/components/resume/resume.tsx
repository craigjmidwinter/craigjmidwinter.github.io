import React, { useEffect, useState } from 'react'
import { PrintResume } from './print/resume'
import { WebResume } from './web/resume'
import { ResumeProps } from './types'

export const Resume = (props: ResumeProps) => {
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    // Add a listener for when the page is being printed
    const mediaQueryList = window.matchMedia('print')
    mediaQueryList.addListener(handlePrint)

    // Remove the listener when the component unmounts
    return () => mediaQueryList.removeListener(handlePrint)
  }, [])

  const handlePrint = (event: MediaQueryListEvent) => {
    // Update the state to reflect whether the page is being printed
    setIsPrinting(event.matches)
  }

  return (
    <div>
      <PrintResume {...props} />
      {/*{isPrinting ? (*/}
      {/*  // Render one set of content if the page is being printed*/}
      {/*  <PrintResume {...props} />*/}
      {/*) : (*/}
      {/*  // Render another set of content if the page is not being printed*/}
      {/*  <WebResume {...props} />*/}
      {/*)}*/}
    </div>
  )
}
