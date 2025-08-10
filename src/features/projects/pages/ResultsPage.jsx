import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Accordion, AccordionHeading, AccordionPanel, AccordionToggleIcon, Utility, Typography } from '@visa/nova-react'
import { Chart } from 'react-google-charts'

import { useHistogram } from '../../../shared/hooks/useHistogram.js'
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
  vAxis: { scaleType: 'mirrorLog' },
  hAxis: { gridlines: { count: 8 } },
  bar: { groupWidth: '75%' },
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
        Distributions
      </Typography>
      <Accordion>
        <AccordionHeading buttonSize="large" colorScheme="secondary">
          <AccordionToggleIcon />
          Area and Perimeter Distribution
        </AccordionHeading>
        <AccordionPanel className="no-horizontal-padding">
          <Chart
            chartType="ColumnChart"
            data={areaHistogramData}
            options={{ ...options, title: 'Area Distribution' }}
          />
          <br />
          <Chart
            chartType="ColumnChart"
            data={perimeterHistogramData}
            options={{ ...options, title: 'Perimeter Distribution' }}
          />
        </AccordionPanel>
      </Accordion>

      <Accordion>
        <AccordionHeading buttonSize="large" colorScheme="secondary">
          <AccordionToggleIcon />
          Aspect Ratio and Angle Distribution
        </AccordionHeading>
        <AccordionPanel className="no-horizontal-padding">
          <Chart
            chartType="ColumnChart"
            data={ratioHistogramData}
            options={{ ...options, title: 'Aspect Ratio Distribution' }}
          />
          <br />
          <Chart
            chartType="ColumnChart"
            data={angleHistogramData}
            options={{ ...options, title: 'Angle Distribution' }}
          />
        </AccordionPanel>
      </Accordion>
    </Utility>
  )
}
