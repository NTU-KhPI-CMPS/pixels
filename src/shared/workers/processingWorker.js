import cvModule from '@techstark/opencv-js'

import { getResult } from './opencvPipeline.js'

const opencvLoaded = loadOpenCv()

async function loadOpenCv() {
  if (!cvModule.calledRun) {
    await new Promise((resolve) => {
      cvModule.onRuntimeInitialized = resolve
    })
  }
  self.cv = cvModule
}

self.onmessage = async ({ data: { taskId, id, settings } }) => {
  try {
    await opencvLoaded
    const [images, stats] = await getResult(id, settings)
    self.postMessage({ taskId, images, stats })
  } catch (error) {
    self.postMessage({ taskId, error: error?.message ?? String(error) })
  }
}
