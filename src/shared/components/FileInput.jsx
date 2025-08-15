import { useRef } from 'react'
import { Button } from '@visa/nova-react'

export default function FileInput({ title, accept, handler }) {

  const inputRef = useRef(null)

  async function fileSelected(event) {
    if (event.target.files && event.target.files.length > 0) {
      handler(event.target.files[0])
      event.target.value = null
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        id="fileInput"
        accept={accept}
        style={{ display: 'none' }}
        onChange={fileSelected}
      />
      <Button onClick={() => inputRef.current.click()}>
        {title}
      </Button>
    </div>
  )
}
