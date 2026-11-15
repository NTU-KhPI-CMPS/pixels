import { useDispatch, useSelector } from 'react-redux'

import {
  Accordion,
  AccordionHeading,
  AccordionPanel,
  AccordionToggleIcon,
  Button,
  Divider,
  Typography,
  Utility,
} from '@visa/nova-react'

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
            <Stage
              title="1. Preprocessing"
              description="Prepares the image: removes the microscope info bar and smooths out fine noise."
            >
              <NumberInput
                title="Crop Bottom (%)"
                name="cropBottom"
                max={50}
                description="Part of the image height cut from the bottom, e.g. an SEM info bar."
                initialValue={settings.cropBottom}
              />
              <NumberInput
                title="Median Blur Size"
                name="blurSize"
                min={1}
                max={31}
                step={2}
                oddOnly
                description="Larger removes more speckle but softens small features. 1 turns it off."
                initialValue={settings.blurSize}
              />
            </Stage>

            <Divider />

            <Stage
              title="2. Binarization"
              description="Marks pixels that are darker than their surroundings as features."
            >
              <NumberInput
                title="Threshold Block Size"
                name="blockSize"
                min={1}
                max={255}
                step={2}
                description="Size of the area each pixel is compared with. Should be larger than the features."
                initialValue={settings.blockSize}
              />
              <NumberInput
                title="Threshold C"
                name="c"
                min={1}
                max={255}
                description="How much darker than its surroundings a pixel must be. Higher finds fewer, darker features."
                initialValue={settings.c}
              />
            </Stage>

            <Divider />

            <Stage
              title="3. Cleanup"
              description="Removes small specks and separates features that touch through thin bridges."
            >
              <NumberInput
                title="Opening Kernel Size"
                name="openSize"
                min={1}
                max={51}
                description="Larger removes bigger specks and splits more features. 1 turns it off."
                initialValue={settings.openSize}
              />
            </Stage>

            <Divider />

            <Stage
              title="4. Feature Filtering"
              description="Keeps only features whose area is within the range. Area is measured in pixels."
            >
              <NumberInput
                title="Minimum Area"
                name="minArea"
                description="Smaller features are ignored as noise."
                initialValue={settings.minArea}
              />
              <NumberInput
                title="Maximum Area"
                name="maxArea"
                description="Larger regions are ignored."
                initialValue={settings.maxArea}
              />
            </Stage>
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

function Stage({ title, description, children }) {
  return (
    <Utility vFlex vFlexCol vGap={6}>
      <Typography tag="h3" variant="subtitle-2">
        {title}
      </Typography>
      <Typography variant="body-3">
        {description}
      </Typography>
      <Utility className="flex-container">
        {children}
      </Utility>
    </Utility>
  )
}
