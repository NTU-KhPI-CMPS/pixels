import { useEffect, useState } from 'react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Input,
  InputContainer,
  Label,
  Typography,
  useFocusTrap,
  Utility,
} from '@visa/nova-react'

const dialogId = 'dialog'
const inputId = 'input'

export default function NewProjectPopup({ onClose }) {
  const { onKeyNavigation, ref } = useFocusTrap()
  const [text, setText] = useState('')

  useEffect(() => {
    ref.current.showModal()
    ref.current.onclose = () => {
      onClose(ref.current.returnValue)
    }
  }, [onClose, ref])

  return (
    <>
      <Dialog
        id={dialogId}
        ref={ref}
        aria-describedby={`${dialogId}-description`}
        aria-labelledby={`${dialogId}-title`}
        onKeyDown={e => onKeyNavigation(e, ref.current?.open)}
      >
        <DialogContent>
          <DialogHeader id={`${dialogId}-title`}>
            Create New Project
          </DialogHeader>
          <Typography id={`${dialogId}-description`}>
            Enter the name of the new project
          </Typography>
          <Utility
            vFlex
            vFlexCol
            vGap={4}
            vMarginTop={10}
          >
            <Label htmlFor={inputId}>
              Project Name (required)
            </Label>
            <InputContainer>
              <Input
                id={inputId}
                type="text"
                aria-required="true"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </InputContainer>
          </Utility>
          <Utility
            vAlignItems="center"
            vFlex
            vFlexWrap
            vGap={8}
            vPaddingTop={16}
          >
            <Button onClick={() => ref.current.close(text)}>
              Create
            </Button>
            <Button
              colorScheme="secondary"
              onClick={() => ref.current.close('')}
            >
              Cancel
            </Button>
          </Utility>
        </DialogContent>
      </Dialog>
    </>
  )
}
