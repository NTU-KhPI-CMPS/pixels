import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { projectActions } from '../../store/projectSlice.js'
import { resultsOpened } from '../../store/processingSlice.js'

export const processingMiddleware = createListenerMiddleware()
processingMiddleware.startListening({
  matcher: isAnyOf(
    projectActions.settingsChanged,
  ),
  effect: async (action, api) =>
    await api.dispatch(resultsOpened()),
})
