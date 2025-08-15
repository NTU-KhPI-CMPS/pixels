import { useDispatch, useSelector } from 'react-redux'

import { projectActions, selectSelectedProject } from '../../../store/projectSlice.js'
import { storeImage } from '../../../shared/utils/indexedDBUtils.js'

import ImageView from '../../../shared/components/ImageView.jsx'
import FileInput from '../../../shared/components/FileInput.jsx'

export default function SourcesPage() {

  const dispatch = useDispatch()
  const currentProject = useSelector(selectSelectedProject)

  async function fileSelected(file) {
    const id = await storeImage(file)
    dispatch(projectActions.fileAdded(id))
  }

  return (
    <>
      <FileInput
        title="Add New File"
        accept="image/*"
        handler={fileSelected}
      />
      <ImageView imageIdsOrUrls={currentProject.files ?? []} />
    </>
  )
}
