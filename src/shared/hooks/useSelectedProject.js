import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectProjects, selectSelectedProject } from '../../store/projectSlice.js'

export function useSelectedProject() {
  const projects = useSelector(selectProjects)
  const selectedProject = useSelector(selectSelectedProject)

  const navigate = useNavigate()
  const location = useLocation()

  const result = useMemo(() => {
    return projects.find(project => project.id === selectedProject)
  }, [projects, selectedProject])

  useEffect(() => {
    if (!result && location.pathname !== '/projects') {
      navigate('projects')
    }
  }, [result, navigate, location.pathname])

  return result
}
