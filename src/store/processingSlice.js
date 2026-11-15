import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { processImage } from '../shared/utils/workerPool.js'
import { revokeResults } from '../shared/utils/urlUtils.js'

export const resultsOpened = createAsyncThunk(
  'projects/resultsOpened',
  async (payload, thunkAPI) => {
    const projectState = thunkAPI.getState().project

    const selectedProject = projectState.projects.find(project => project.isSelected)
    const files = selectedProject.files
    const settings = selectedProject.settings

    const processingResults = await Promise.all(
      files.map(file => processImage(file, settings, thunkAPI.signal)),
    ).catch((error) => {
      if (thunkAPI.signal.aborted) {
        throw thunkAPI.rejectWithValue({})
      }
      throw error
    })

    if (thunkAPI.signal.aborted) {
      throw thunkAPI.rejectWithValue({})
    }

    const resultData = {}
    const statsData = {}
    files.forEach((file, index) => {
      const [imageBlobs, stats] = processingResults[index]
      resultData[file] = imageBlobs.map(blob => URL.createObjectURL(blob))
      statsData[file] = stats
    })

    return [resultData, statsData]
  },
)

export const initialState = {
  loading: 0,
  results: {},
  stats: {},
}

export const processingSlice = createSlice({
  name: 'processing',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(resultsOpened.pending, (state) => {
      revokeResults(state.results)
      state.loading = state.loading + 1
      state.results = {}
      state.stats = {}
    })
    builder.addCase(resultsOpened.rejected, (state) => {
      state.loading = state.loading - 1
    })
    builder.addCase(resultsOpened.fulfilled, (state, action) => {
      state.loading = state.loading - 1
      state.results = action.payload[0]
      state.stats = action.payload[1]
    })
  },
})

export const selectResults = state => state.processing.results
export const selectStats = state => state.processing.stats
export const selectLoading = state => state.processing.loading > 0

export default processingSlice.reducer
