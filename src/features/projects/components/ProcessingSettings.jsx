import { useDispatch, useSelector } from 'react-redux'

import { Accordion, AccordionHeading, AccordionPanel, AccordionToggleIcon, Button, Utility } from '@visa/nova-react'

import { projectActions, selectSelectedProject } from '../../../store/projectSlice.js'

import NumberInput from '../../../shared/components/NumberInput.jsx'

export default function ProcessingSettings() {

  const dispatch = useDispatch()
  const settings = useSelector(selectSelectedProject).settings

  function onSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)

    const data = {}
    formData.forEach((value, key) =>
      data[key] = Number.parseInt(value),
    )

    dispatch(projectActions.settingsChanged(data))
  }

  return (
    <Accordion>
      <AccordionHeading buttonSize="large" colorScheme="secondary">
        <AccordionToggleIcon />
        Processing Settings
      </AccordionHeading>

      <AccordionPanel>
        <form onSubmit={onSubmit}>
          <Utility vFlex vFlexCol vGap={10}>
            <Utility className="flex-container">
              <NumberInput
                title="Threshold Block Size"
                name="blockSize"
                min={1}
                max={255}
                step={2}
                initialValue={settings.blockSize}
              />
              <NumberInput
                title="Threshold C"
                name="c"
                min={1}
                max={255}
                initialValue={settings.c}
              />
            </Utility>

            <Utility className="flex-container">
              <NumberInput
                title="Canny Threshold 1"
                name="canny1"
                min={1}
                max={255}
                initialValue={settings.canny1}
              />
              <NumberInput
                title="Canny Threshold 2"
                name="canny2"
                min={1}
                max={255}
                initialValue={settings.canny2}
              />
            </Utility>

            <Utility className="flex-container">
              <NumberInput
                title="Closing Kernel Width"
                name="kernelWidth"
                max={255}
                initialValue={settings.kernelWidth}
              />
              <NumberInput
                title="Closing Kernel Height"
                name="kernelHeight"
                max={255}
                initialValue={settings.kernelHeight}
              />
            </Utility>

            <Utility className="flex-container">
              <NumberInput title="Minimum Area" name="minArea" initialValue={settings.minArea} />
              <NumberInput title="Maximum Area" name="maxArea" initialValue={settings.maxArea} />
            </Utility>
          </Utility>

          <Utility vFlex vJustifyContent="end" vMarginTop={10}>
            <Button type="submit">
              Save
            </Button>
          </Utility>
        </form>
      </AccordionPanel>
    </Accordion>
  )
}
