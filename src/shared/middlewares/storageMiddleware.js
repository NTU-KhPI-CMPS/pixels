import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { projectActions } from '../../store/projectSlice.js'
import { deleteProject, storeProjects } from '../utils/indexedDBUtils.js'

export const storageMiddleware = createListenerMiddleware()
storageMiddleware.startListening({
  matcher: isAnyOf(
    projectActions.projectCreated,
    projectActions.fileAdded,
    projectActions.fileDeleted,
  ),
  effect: async (action, listenerApi) =>
    await storeProjects(listenerApi.getState().project.projects),
})
storageMiddleware.startListening({
  matcher: isAnyOf(
    projectActions.projectDeleted,
  ),
  effect: async action =>
    await deleteProject(action.payload),
})
