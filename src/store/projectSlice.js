import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  projects: [],
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    projectSelected: (state, { payload }) => {
      const project = state.projects.find(project => project.id === payload)
      project.isSelected = true
    },
    projectCreated: (state, { payload }) => {
      state.projects.push(payload)
    },
    projectDeleted: (state, { payload }) => {
      state.projects = state.projects.filter(project => project.id !== payload)
    },
    settingsChanged: (state, { payload }) => {
      const project = state.projects.find(project => project.isSelected)
      project.settings = payload
    },
    fileAdded: (state, { payload }) => {
      const project = state.projects.find(project => project.isSelected)
      const files = project.files ?? []
      files.push(payload)
      project.files = files
      project.imagesCount++
    },
    fileDeleted: (state, { payload }) => {
      const project = state.projects.find(project => project.isSelected)
      let files = project.files ?? []
      files = files.filter(item => item !== payload)
      project.files = files
      project.imagesCount--
    },
  },
})

export const projectActions = projectSlice.actions

export const selectSelectedProject = state => state.project.projects.find(project => project.isSelected)
export const selectProjects = state => state.project.projects

export default projectSlice.reducer
