import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Typography } from '@visa/nova-react'

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

export default function ResultsPage() {

  const dispatch = useDispatch()
  const stats = useSelector(selectStats)

  const binarizationData = useMemo(() => {
    return Object.values(stats).map(data => data[0])
  }, [stats])
  const contoursData = useMemo(() => {
    return Object.values(stats).map(data => data[1])
  }, [stats])

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
    </>
  )
}
