import { Fragment, useRef } from 'react'

import { Accordion, AccordionHeading, AccordionPanel, AccordionToggleIcon } from '@visa/nova-react'
import { Chart } from 'react-google-charts'

const options = {
  legend: { position: 'top' },
  vAxis: { scaleType: 'mirrorLog' },
  hAxis: { gridlines: { count: 8 } },
  bar: { groupWidth: '75%' },
}

export default function ChartAccordion({ title, chartTitles, charts }) {

  const ref = useRef([])

  const renderedCharts = charts.map((data, index) => {
    const chartWrapper = chartWrapper => ref.current[index] = chartWrapper

    return (
      <Fragment key={index}>
        {index !== 0 && <br />}
        <Chart
          chartType="ColumnChart"
          data={data}
          options={{ ...options, title: chartTitles[index] }}
          getChartWrapper={chartWrapper}
        />
      </Fragment>
    )
  })

  function redraw() {
    ref.current.forEach(wrapper => wrapper.draw())
  }

  return (
    <Accordion onToggle={redraw}>
      <AccordionHeading buttonSize="large" colorScheme="secondary">
        <AccordionToggleIcon />
        {title}
      </AccordionHeading>
      <AccordionPanel className="no-horizontal-padding">
        {renderedCharts}
      </AccordionPanel>
    </Accordion>
  )
}
