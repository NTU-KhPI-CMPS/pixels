const POOL_SIZE = Math.max(1, Math.min(navigator.hardwareConcurrency, 10))

const workers = []
const idleWorkers = []
const queue = []
const pending = new Map()
let nextTaskId = 0

export function processImage(id, settings, signal) {
  return new Promise((resolve, reject) => {
    queue.push({ taskId: nextTaskId++, id, settings, signal, resolve, reject })
    drainQueue()
  })
}

function drainQueue() {
  while (queue.length > 0) {
    const task = queue[0]
    if (task.signal?.aborted) {
      queue.shift()
      task.reject(new DOMException('Aborted', 'AbortError'))
      continue
    }

    const worker = acquireWorker()
    if (!worker) {
      return
    }

    queue.shift()
    pending.set(task.taskId, task)
    worker.postMessage({ taskId: task.taskId, id: task.id, settings: task.settings })
  }
}

function acquireWorker() {
  if (idleWorkers.length > 0) {
    return idleWorkers.pop()
  }
  if (workers.length < POOL_SIZE) {
    return createWorker()
  }
  return null
}

function createWorker() {
  const worker = new Worker(new URL('../workers/processingWorker.js', import.meta.url), { type: 'module' })

  worker.onmessage = ({ data }) => {
    const task = pending.get(data.taskId)
    pending.delete(data.taskId)

    if (data.error) {
      task.reject(new Error(data.error))
    } else {
      task.resolve([data.images, data.stats])
    }

    releaseWorker(worker)
  }

  worker.onerror = (event) => {
    console.error('Processing worker failed', event)
  }

  workers.push(worker)
  return worker
}

function releaseWorker(worker) {
  idleWorkers.push(worker)
  drainQueue()
}
