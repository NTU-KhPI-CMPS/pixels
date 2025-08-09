import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  projects: [],
  selectedProject: null,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    projectSelected: (state, { payload }) => {
      state.selectedProject = payload
    },
    projectCreated: (state, { payload }) => {
      state.projects.push(payload)
    },
    projectDeleted: (state, { payload }) => {
      state.projects = state.projects.filter(project => project.id !== payload)
      if (state.selectedProject === payload) {
        state.selectedProject = null
      }
    },
    settingsChanged: (state, { payload }) => {
      const project = state.projects.find(project => project.id === state.selectedProject)
      project.settings = payload
    },
    fileAdded: (state, { payload }) => {
      const project = state.projects.find(project => project.id === state.selectedProject)
      const files = project.files ?? []
      files.push(payload)
      project.files = files
      project.imagesCount++
    },
    fileDeleted: (state, { payload }) => {
      const project = state.projects.find(project => project.id === state.selectedProject)
      let files = project.files ?? []
      files = files.filter(item => item !== payload)
      project.files = files
      project.imagesCount--
    },
  },
})

export const projectActions = projectSlice.actions

export const selectSelectedProject = state => state.project.selectedProject
export const selectProjects = state => state.project.projects

export default projectSlice.reducer
