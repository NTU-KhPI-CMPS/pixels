import { getImage } from './indexedDBUtils.js'

export async function getResult(id, settings) {
  await window.opencvLoaded

  const images = []
  const stats = []
  const inputData = await getMatFromDb(id)

  const binaryData = await binarize(inputData.mat, settings)
  images.push(binaryData.url)
  stats.push({ ...binaryData.stats, name: inputData.name })

  const cannyData = await canny(binaryData.binaryMat, settings)
  binaryData.binaryMat.delete()
  images.push(cannyData.url)

  const contoursData = await contours(cannyData.closedMat, settings)
  cannyData.closedMat.delete()

  const enhancedContourStats = await enhanceContoursStats(inputData.mat, contoursData.stats)
  stats.push({ ...enhancedContourStats, name: inputData.name })

  const drawnContours = await drawContours(inputData.mat, contoursData.filteredContours)
  contoursData.filteredContours.delete()
  images.push(drawnContours.url)

  inputData.mat.delete()
  return [images, stats]
}

async function binarize(input, { blockSize, c }) {
  let gray = new cv.Mat()
  cv.cvtColor(input, gray, cv.COLOR_RGBA2GRAY)

  let binaryMat = new cv.Mat()
  cv.adaptiveThreshold(gray, binaryMat, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, blockSize, c)
  gray.delete()

  const stats = await getBinaryStats(input, binaryMat)
  const url = await getUrlFromMat(binaryMat)

  return { url, stats, binaryMat }
}

async function canny(input, { canny1, canny2, kernelWidth, kernelHeight }) {
  let canny = new cv.Mat()
  cv.Canny(input, canny, canny1, canny2)

  let closedMat = new cv.Mat()
  let kernel = cv.Mat.ones(kernelWidth, kernelHeight, cv.CV_8U)
  cv.morphologyEx(canny, closedMat, cv.MORPH_CLOSE, kernel)
  kernel.delete()
  canny.delete()

  const url = await getUrlFromMat(closedMat)
  return { url, closedMat }
}

async function contours(input, { minArea, maxArea }) {
  let contours = new cv.MatVector()
  cv.findContours(input, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_KCOS)

  let filteredContours = new cv.MatVector()
  let stats = null
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i)
    const area = cv.contourArea(contour)
    const perimeter = cv.arcLength(contour, true)

    if (area >= minArea && area <= maxArea) {
      filteredContours.push_back(contour)
      stats = await processContourForStats(area, perimeter, stats)
    }
  }
  contours.delete()

  return { filteredContours, stats }
}

async function drawContours(input, contours) {
  let dstMat = input.clone()
  cv.drawContours(dstMat, contours, -1, new cv.Scalar(255, 0, 0, 255), -1)

  const url = await getUrlFromMat(dstMat)
  dstMat.delete()

  return { url }
}

async function getBinaryStats(original, binary) {
  const size = original.size()
  const totalPixels = size.width * size.height
  const lightPixels = cv.countNonZero(binary)
  const darkPixels = totalPixels - lightPixels
  const percentage = (darkPixels / totalPixels) * 100.0

  return {
    totalPixels,
    lightPixels,
    darkPixels,
    percentage,
  }
}

async function processContourForStats(area, perimeter, stats) {
  stats = stats ?? {
    count: 0,

    areas: [],
    totalArea: 0,
    minArea: Number.MAX_VALUE,
    maxArea: -Number.MAX_VALUE,

    perimeters: [],
    totalPerimeter: 0,
    minPerimeter: Number.MAX_VALUE,
    maxPerimeter: -Number.MAX_VALUE,
  }

  stats.count++

  stats.areas.push(area)
  stats.totalArea += area
  stats.minArea = Math.min(stats.minArea, area)
  stats.maxArea = Math.max(stats.maxArea, area)

  stats.perimeters.push(perimeter)
  stats.totalPerimeter += perimeter
  stats.minPerimeter = Math.min(stats.minPerimeter, perimeter)
  stats.maxPerimeter = Math.max(stats.maxPerimeter, perimeter)

  return stats
}

async function enhanceContoursStats(originalMat, stats) {
  const averageArea = stats.totalArea / stats.count
  const averagePerimeter = stats.totalPerimeter / stats.count
  const size = originalMat.size()
  const imageArea = size.width * size.height
  const percentage = (stats.totalArea / imageArea) * 100.0

  stats.areas.sort((e1, e2) => e1 - e2)
  stats.perimeters.sort((e1, e2) => e1 - e2)

  return {
    ...stats,
    averageArea, averagePerimeter, percentage,
  }
}

async function getMatFromDb(id) {
  const imageData = await getImage(id)
  const imageUrl = URL.createObjectURL(imageData.blob)

  const image = new Image()
  await new Promise((resolve) => {
    image.onload = resolve
    image.src = imageUrl
  })

  URL.revokeObjectURL(imageUrl)
  return { mat: cv.imread(image), name: imageData.blob.name }
}

async function getUrlFromMat(mat) {
  const canvas = document.createElement('canvas')
  cv.imshow(canvas, mat)

  const blob = await new Promise(resolve => canvas.toBlob(resolve))

  return URL.createObjectURL(blob)
}
