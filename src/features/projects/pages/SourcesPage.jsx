import { useRef } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@visa/nova-react'

import { projectActions } from '../../../store/projectSlice.js'
import { storeImage } from '../../../shared/utils/indexedDBUtils.js'
import { useSelectedProject } from '../../../shared/hooks/useSelectedProject.js'

import ImageView from '../../../shared/components/ImageView.jsx'

export default function SourcesPage() {
  const inputRef = useRef(null)
  const dispatch = useDispatch()

  const currentProject = useSelectedProject()

  async function fileSelected(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const id = await storeImage(file)
      event.target.value = null
      dispatch(projectActions.fileAdded(id))
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={fileSelected}
      />
      <Button onClick={() => inputRef.current.click()}>
        Add New File
      </Button>

      <ImageView imageIdsOrUrls={currentProject.files ?? []} />
    </>
  )
}
