async function getDb() {
  const request = indexedDB.open('MyDatabase', 3)

  request.onupgradeneeded = function (event) {
    const db = event.target.result

    if (db.objectStoreNames.contains('files')) {
      db.deleteObjectStore('files')
    }
    if (db.objectStoreNames.contains('projects')) {
      db.deleteObjectStore('projects')
    }

    db.createObjectStore('files', { keyPath: 'id' })
    db.createObjectStore('projects', { keyPath: 'id' })
  }

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function storeProjects(projects) {
  const db = await getDb()
  const transaction = db.transaction('projects', 'readwrite')
  const store = transaction.objectStore('projects')

  const promises = projects.map((project) => {
    return new Promise((resolve, reject) => {
      const request = store.put(project)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  return Promise.all(promises)
}

export async function deleteProject(projectId) {
  const db = await getDb()
  const transaction = db.transaction('projects', 'readwrite')
  const store = transaction.objectStore('projects')

  return new Promise((resolve, reject) => {
    const request = store.delete(projectId)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllProjects() {
  const db = await getDb()
  const transaction = db.transaction('projects', 'readonly')
  const store = transaction.objectStore('projects')

  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function storeImage(file) {
  const db = await getDb()
  const id = Math.random().toString(16).slice(2)

  const transaction = db.transaction('files', 'readwrite')
  const store = transaction.objectStore('files')

  return new Promise((resolve, reject) => {
    const request = store.put({
      id: id,
      blob: file,
      name: file.name,
    })

    request.onsuccess = () => resolve(id)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteImage(imageId) {
  const db = await getDb()
  const transaction = db.transaction('files', 'readwrite')
  const store = transaction.objectStore('files')

  return new Promise((resolve, reject) => {
    const request = store.delete(imageId)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteProjectImages(project) {
  const db = await getDb()
  const transaction = db.transaction('files', 'readwrite')
  const store = transaction.objectStore('files')

  const files = project.files ?? []
  const promises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const request = store.delete(file)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  return Promise.all(promises)
}

export async function getImage(id) {
  const db = await getDb()

  const transaction = db.transaction('files', 'readonly')
  const store = transaction.objectStore('files')

  return new Promise((resolve, reject) => {
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
