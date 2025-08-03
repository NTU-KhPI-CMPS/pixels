import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Utility } from '@visa/nova-react'
import { GenericArrowForwardTiny, GenericCheckmarkTiny, GenericDeleteTiny } from '@visa/nova-icons-react'

import { projectActions, selectProjects } from '../../../store/projectSlice.js'
import { deleteProjectImages } from '../../../shared/utils/indexedDBUtils.js'
import { useSelectedProject } from '../../../shared/hooks/useSelectedProject.js'

import Grid from '../../../shared/components/Grid.jsx'
import NewProjectPopup from '../popups/NewProject.jsx'

export default function ProjectPage() {

  const [popup, setPopup] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const projects = useSelector(selectProjects)
  const selectedProject = useSelectedProject()

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
          disabled={selectedProject?.id === row.id}
          onClick={() => projectSelected(row.id)}
        >
          {selectedProject?.id === row.id ? <GenericCheckmarkTiny /> : <GenericArrowForwardTiny />}
        </Button>
        <Button onClick={() => deleteProject(row.id)}>
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
      }
      dispatch(projectActions.projectCreated(project))
    }
  }

  return (
    <>
      {popup && <NewProjectPopup onClose={popupClosed} />}
      <Utility vMarginBottom={10}>
        <Button onClick={() => setPopup(true)}>
          Create New Project
        </Button>
      </Utility>
      <Grid
        schema={tableSchema}
        data={projects}
      />
    </>
  )
}
