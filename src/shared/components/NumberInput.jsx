import { useId, useState } from 'react'

import { Input, InputContainer, Label } from '@visa/nova-react'

export default function NumberInput(
  {
    title,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    step = 1,
    initialValue = min,
    ...other
  }) {

  const id = useId()
  const [value, setValue] = useState(initialValue)

  function blurred() {
    setValue((value) => {
      const rounded = other.oddOnly ? roundFloatToNearestOddInt(value) : Math.round(value)
      return Math.min(max, Math.max(min, rounded))
    })
  }

  function roundFloatToNearestOddInt(f) {
    const round = Math.round(f)

    if (round % 2 === 0) {
      const upDiff = Math.abs(f - (round + 1))
      const downDiff = Math.abs(f - (round - 1))

      return upDiff < downDiff ? round + 1 : round - 1
    }

    return round
  }

  return (
    <div className="full-width">
      <Label htmlFor={id}>
        {`${title} (${min} - ${max})`}
      </Label>

      <InputContainer>
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={blurred}
          {...other}
        />
      </InputContainer>
    </div>
  )
}
