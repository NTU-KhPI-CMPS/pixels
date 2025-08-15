import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Utility } from '@visa/nova-react'
import {
  GenericArrowForwardTiny,
  GenericCheckmarkTiny,
  GenericDeleteTiny,
  GenericFileDownloadTiny,
} from '@visa/nova-icons-react'

import { defaultSettings } from '../../../config/index.js'
import {
  downloadProject,
  importProject,
  projectActions,
  selectProjects,
  selectSelectedProject,
} from '../../../store/projectSlice.js'
import { deleteProjectImages } from '../../../shared/utils/indexedDBUtils.js'

import Grid from '../../../shared/components/Grid.jsx'
import NewProjectPopup from '../popups/NewProject.jsx'
import FileInput from '../../../shared/components/FileInput.jsx'

export default function ProjectPage() {

  const [popup, setPopup] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const projects = useSelector(selectProjects)
  const selectedProject = useSelector(selectSelectedProject)

  const tableSchema = [
    {
      name: 'Project Name',
      key: 'name',
    },
    {
      name: 'Number of Images',
      key: 'imagesCount',
    },
    {
      name: 'Actions',
      mapper: actionMapper,
    },
  ]

  function actionMapper(row) {
    return (
      <Utility vFlex vFlexGrow vGap={10}>
        <Button
          colorScheme="secondary"
          title="Select this project"
          disabled={selectedProject?.id === row.id}
          onClick={() => projectSelected(row.id)}
        >
          {selectedProject?.id === row.id ? <GenericCheckmarkTiny /> : <GenericArrowForwardTiny />}
        </Button>
        <Button title="Export this project" onClick={() => dispatch(downloadProject(row.id))}>
          <GenericFileDownloadTiny />
        </Button>
        <Button title="Delete this project" onClick={() => deleteProject(row.id)}>
          <GenericDeleteTiny />
        </Button>
      </Utility>
    )
  }

  async function deleteProject(projectId) {
    const projectToDelete = projects.find(project => project.id === projectId)

    await deleteProjectImages(projectToDelete)

    dispatch(projectActions.projectDeleted(projectId))
  }

  function projectSelected(id) {
    dispatch(projectActions.projectSelected(id))
    navigate('/sources')
  }

  function popupClosed(value) {
    setPopup(false)

    if (value) {
      const project = {
        id: Math.random().toString(16).slice(2),
        name: value,
        imagesCount: 0,
        settings: defaultSettings,
      }
      dispatch(projectActions.projectCreated(project))
    }
  }

  return (
    <>
      {popup && <NewProjectPopup onClose={popupClosed} />}
      <Utility
        vFlex
        vFlexRow
        vGap={10}
        vMarginBottom={10}
      >
        <Button onClick={() => setPopup(true)}>
          Create New Project
        </Button>
        <FileInput
          title="Import Project"
          accept=".pixels"
          handler={file => dispatch(importProject(file))}
        />
      </Utility>
      <Grid
        schema={tableSchema}
        data={projects}
      />
    </>
  )
}
