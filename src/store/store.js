import { configureStore } from '@reduxjs/toolkit'

import { storageMiddleware } from '../shared/middlewares/storageMiddleware.js'
import { processingMiddleware } from '../shared/middlewares/processingMiddleware.js'
import { getAllProjects } from '../shared/utils/indexedDBUtils.js'

import projectSlice, { initialState } from './projectSlice.js'
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
        processingMiddleware.middleware,
      )
    ),
  })
}
