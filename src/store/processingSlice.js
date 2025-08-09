import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getResult } from '../shared/utils/opencvUtils.js'
import { revokeResults } from '../shared/utils/urlUtils.js'

export const resultsOpened = createAsyncThunk(
  'projects/resultsOpened',
  async (payload, thunkAPI) => {
    const projectState = thunkAPI.getState().project

    const selectedProject = projectState.projects.find(project => project.isSelected)
    const files = selectedProject.files
    const settings = selectedProject.settings

    const resultData = {}
    const statsData = {}
    for (const file of files) {
      if (thunkAPI.signal.aborted) {
        revokeResults(resultData)
        throw thunkAPI.rejectWithValue({})
      }

      const processingResult = await getResult(file, settings)
      resultData[file] = processingResult[0]
      statsData[file] = processingResult[1]
    }

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
