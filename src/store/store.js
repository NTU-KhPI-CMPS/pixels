import { configureStore } from '@reduxjs/toolkit'

import { storageMiddleware } from '../shared/middlewares/storageMiddleware.js'
import { getAllProjects } from '../shared/utils/indexedDBUtils.js'

import { initialState } from './projectSlice.js'
import projectSlice from './projectSlice.js'
import processingSlice from './processingSlice.js'

export const getPreloadedStore = async () => {
  const preloadedState = await getAllProjects()

  return configureStore({
    preloadedState: {
      project: { ...initialState, projects: preloadedState },
    },
    reducer: {
      project: projectSlice,
      processing: processingSlice,
    },
    middleware: getDefaultMiddleware => (
      getDefaultMiddleware().concat(
        storageMiddleware.middleware,
      )
    ),
  })
}
