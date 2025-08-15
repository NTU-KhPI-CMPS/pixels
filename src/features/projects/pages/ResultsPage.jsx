import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Utility, Typography } from '@visa/nova-react'

import { useHistogram } from '../../../shared/hooks/useHistogram.js'
import { resultsOpened, selectStats } from '../../../store/processingSlice.js'

import Grid from '../../../shared/components/Grid.jsx'
import ChartAccordion from '../../../shared/components/ChartAccordion.jsx'

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

const angleTableSchema = [
  { name: 'Name', key: 'name' },
  { name: 'Count', key: 'count' },
  { name: 'Average Angle', key: 'angleAverage' },
  { name: 'R', key: 'r' },
  { name: 'Average Ratio', key: 'averageRatio' },
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
  const angleData = useMemo(() => {
    return Object.values(stats).map(data => data[2])
  }, [stats])

  const areaHistogramData = useHistogram(contoursData, 'areas', 'minArea', 'maxArea')
  const perimeterHistogramData = useHistogram(contoursData, 'perimeters', 'minPerimeter', 'maxPerimeter')
  const angleHistogramData = useHistogram(angleData, 'angles', 'minAngle', 'maxAngle')
  const ratioHistogramData = useHistogram(angleData, 'ratios', 'minRatio', 'maxRatio')

  useEffect(() => {
    const dispatchPromise = dispatch(resultsOpened())

    return () => {
      dispatchPromise.abort()
    }
  }, [dispatch])

  return (
    <Utility vFlex vFlexCol vGap={10}>
      <Typography tag="h2" variant="headline-2">
        Binarization statistics
      </Typography>
      <Grid
        schema={binaryTableSchema}
        data={binarizationData}
      />

      <Typography tag="h2" variant="headline-2">
        Contours statistics
      </Typography>
      <Grid
        schema={contourTableSchema}
        data={contoursData}
      />

      <Typography tag="h2" variant="headline-2">
        Angle statistics
      </Typography>
      <Grid
        schema={angleTableSchema}
        data={angleData}
      />

      <Typography tag="h2" variant="headline-2">
        Distributions
      </Typography>
      <ChartAccordion
        title="Area and Perimeter Distribution"
        chartTitles={['Area Distribution', 'Perimeter Distribution']}
        charts={[areaHistogramData, perimeterHistogramData]}
      />
      <ChartAccordion
        title="Aspect Ratio and Angle Distribution"
        chartTitles={['Aspect Ratio Distribution', 'Angle Distribution']}
        charts={[ratioHistogramData, angleHistogramData]}
      />
    </Utility>
  )
}
