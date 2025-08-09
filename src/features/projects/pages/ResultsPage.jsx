import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { resultsOpened, selectResults } from '../../../store/processingSlice.js'

import ImageView from '../../../shared/components/ImageView.jsx'
import ProcessingSettings from '../components/ProcessingSettings.jsx'

export default function ResultsPage() {

  const dispatch = useDispatch()
  const results = useSelector(selectResults)

  useEffect(() => {
    const dispatchPromise = dispatch(resultsOpened())

    return () => {
      dispatchPromise.abort()
    }
  }, [dispatch])

  return (
    <>
      <ProcessingSettings />
      <ImageView results imageIdsOrUrls={Object.values(results).flatMap(arr => arr)} />
    </>
  )
}
