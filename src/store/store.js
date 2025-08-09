import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { storageMiddleware } from '../shared/middlewares/storageMiddleware.js'
import { getAllProjects } from '../shared/utils/indexedDBUtils.js'

import projectSlice, { initialState, projectActions } from './projectSlice.js'
import processingSlice, { resultsOpened } from './processingSlice.js'

const middleware = createListenerMiddleware()
middleware.startListening({
  matcher: isAnyOf(
    projectActions.settingsChanged,
  ),
  effect: async (action, api) =>
    await api.dispatch(resultsOpened()),
})

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
        middleware.middleware,
      )
    ),
  })
}
