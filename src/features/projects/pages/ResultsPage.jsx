import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Typography } from '@visa/nova-react'
import { Chart } from 'react-google-charts'

import { resultsOpened, selectStats } from '../../../store/processingSlice.js'

import Grid from '../../../shared/components/Grid.jsx'

const binaryTableSchema = [
  { name: 'Name', key: 'name' },
  { name: 'Total', key: 'totalPixels' },
  { name: 'Light', key: 'lightPixels' },
  { name: 'Dark', key: 'darkPixels' },
  { name: 'Dark Percentage', key: 'percentage' },
]

const contourTableSchema = [
  { name: 'Name', key: 'name' },
  { name: 'Count', key: 'count' },
  { name: 'Area Percentage', key: 'percentage' },
  { name: 'Total Area', key: 'totalArea' },
  { name: 'Min Area', key: 'minArea' },
  { name: 'Average Area', key: 'averageArea' },
  { name: 'Max Area', key: 'maxArea' },
  { name: 'Total Perimeter', key: 'totalPerimeter' },
  { name: 'Min Perimeter', key: 'minPerimeter' },
  { name: 'Average Perimeter', key: 'averagePerimeter' },
  { name: 'Max Perimeter', key: 'maxPerimeter' },
]

const options = {
  legend: { position: 'top' },
  histogram: { maxNumBuckets: 10 },
  vAxis: { scaleType: 'mirrorLog' },
  backgroundColor: '#F5F5F5',
}

export default function ResultsPage() {

  const dispatch = useDispatch()
  const stats = useSelector(selectStats)

  const binarizationData = useMemo(() => {
    return Object.values(stats).map(data => data[0])
  }, [stats])
  const contoursData = useMemo(() => {
    return Object.values(stats).map(data => data[1])
  }, [stats])

  const areasHistogramData = useMemo(() => {
    return getHistogramData(contoursData, 'areas')
  }, [contoursData])

  function getHistogramData(data, fieldName) {
    if (!data || data.length === 0) {
      return
    }

    const maxLength = Math.max(...data.map(image => image[fieldName].length))
    const header = data.map(image => image.name)
    const result = [header]

    for (let i = 0; i < maxLength; i++) {
      const row = data.map(c => c[fieldName][i] ?? null)
      result.push(row)
    }

    return result
  }

  useEffect(() => {
    const dispatchPromise = dispatch(resultsOpened())

    return () => {
      dispatchPromise.abort()
    }
  }, [dispatch])

  return (
    <>
      <Typography tag="h2" variant="headline-2">
        Binarization statistics
      </Typography>
      <Grid
        schema={binaryTableSchema}
        data={binarizationData}
      />
      <br />
      <Typography tag="h2" variant="headline-2">
        Contours statistics
      </Typography>
      <Grid
        schema={contourTableSchema}
        data={contoursData}
      />
      <br />
      <Typography tag="h2" variant="headline-2">
        Contours area distribution
      </Typography>
      {areasHistogramData && (
        <Chart
          chartType="Histogram"
          data={areasHistogramData}
          options={options}
        />
      )}
    </>
  )
}
