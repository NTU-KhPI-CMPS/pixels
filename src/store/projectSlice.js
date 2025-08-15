import JSZip from 'jszip'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getImage, storeImage } from '../shared/utils/indexedDBUtils.js'

export const downloadProject = createAsyncThunk(
  'projects/downloadProject',
  async (payload, thunkAPI) => {
    const zip = new JSZip()
    const img = zip.folder('images')

    const projectState = thunkAPI.getState().project
    const project = projectState.projects.find(project => project.id === payload)

    for (const image of project.files) {
      const imageData = await getImage(image)
      img.file(imageData.name, imageData.blob)
    }

    zip.file('project.json', JSON.stringify(project))

    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = project.name + '.pixels'
      a.click()
      URL.revokeObjectURL(a.href)
    })
  },
)

export const importProject = createAsyncThunk(
  'projects/importProject',
  async (payload, thunkAPI) => {
    const zip = await JSZip.loadAsync(payload)

    const images = {}
    const img = zip.folder('images')
    img.forEach((path, image) => images[path] = image)

    const savedIds = []
    for (const [name, image] of Object.entries(images)) {
      const imgBlob = await image.async('blob')
      imgBlob.name = name

      const imgId = await storeImage(imgBlob)
      savedIds.push(imgId)
    }

    const projectContent = await zip.file('project.json').async('string')
    const project = JSON.parse(projectContent)
    const updatedProject = {
      ...project,
      id: Math.random().toString(16).slice(2),
      files: savedIds,
      isSelected: false,
    }
    await thunkAPI.dispatch(projectActions.projectCreated(updatedProject))
  },
)

export const initialState = {
  projects: [],
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    projectSelected: (state, { payload }) => {
      state.projects.forEach((project) => {
        project.isSelected = project.id === payload
      })
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
