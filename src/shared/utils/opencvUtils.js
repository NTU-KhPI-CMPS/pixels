import { getImage } from './indexedDBUtils.js'

export async function getResult(id, settings) {
  await window.opencvLoaded

  const images = []
  const stats = []
  const inputData = await getMatFromDb(id)

  const binaryData = await binarize(inputData.inputMat, settings)
  images.push(binaryData.binaryUrl)
  stats.push({ ...binaryData.stats, name: inputData.name })

  const cannyData = await canny(binaryData.binaryMat, settings)
  binaryData.binaryMat.delete()
  images.push(cannyData.cannyUrl)

  const contoursData = await contours(inputData.inputMat, cannyData.cannyMat, settings)
  cannyData.cannyMat.delete()
  stats.push({ ...contoursData.stats, name: inputData.name })

  const angleData = await angles(contoursData.contoursMat, contoursData.filteredContours)
  contoursData.contoursMat.delete()
  contoursData.filteredContours.delete()

  stats.push({ ...angleData.stats, name: inputData.name })
  images.push(angleData.anglesUrls)

  angleData.anglesMat.delete()
  inputData.inputMat.delete()

  return [images, stats]
}

async function binarize(inputMat, { blockSize, c }) {
  let grayMat = new cv.Mat()
  cv.cvtColor(inputMat, grayMat, cv.COLOR_RGBA2GRAY)

  let binaryMat = new cv.Mat()
  cv.adaptiveThreshold(grayMat, binaryMat, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, blockSize, c)
  grayMat.delete()

  const stats = await getBinaryStats(binaryMat)
  const binaryUrl = await getUrlFromMat(binaryMat)

  return { stats, binaryUrl, binaryMat }
}

async function canny(binaryMat, { canny1, canny2, kernelWidth, kernelHeight }) {
  let cannyMat = new cv.Mat()
  cv.Canny(binaryMat, cannyMat, canny1, canny2)

  let kernel = cv.Mat.ones(kernelWidth, kernelHeight, cv.CV_8U)
  cv.morphologyEx(cannyMat, cannyMat, cv.MORPH_CLOSE, kernel)
  kernel.delete()

  const cannyUrl = await getUrlFromMat(cannyMat)
  return { cannyUrl, cannyMat }
}

async function contours(inputMat, edgesMat, { minArea, maxArea }) {
  let contours = new cv.MatVector()
  cv.findContours(edgesMat, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_KCOS)

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

  stats = await addContourStats(inputMat, stats)
  const contoursMat = await drawContours(inputMat, filteredContours)
  return { stats, filteredContours, contoursMat }
}

async function getBinaryStats(binary) {
  const size = binary.size()
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

async function addContourStats(inputMat, stats) {
  const averageArea = stats.totalArea / stats.count
  const averagePerimeter = stats.totalPerimeter / stats.count
  const size = inputMat.size()
  const imageArea = size.width * size.height
  const percentage = (stats.totalArea / imageArea) * 100.0

  stats.areas.sort((e1, e2) => e1 - e2)
  stats.perimeters.sort((e1, e2) => e1 - e2)

  return {
    ...stats,
    averageArea, averagePerimeter, percentage,
  }
}

async function drawContours(matToDraw, contours) {
  let contoursMat = matToDraw.clone()
  cv.drawContours(contoursMat, contours, -1, new cv.Scalar(255, 0, 0, 255), -1)
  return contoursMat
}

async function angles(contoursMat, contours) {
  let anglesMat = contoursMat.clone()
  let stats = null

  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i)
    const rotatedRect = cv.minAreaRect(contour)

    stats = await processRotatedRectForStats(anglesMat, rotatedRect, stats)
  }

  stats.angles.sort((e1, e2) => e1 - e2)
  stats.ratios.sort((e1, e2) => e1 - e2)

  stats.count = stats.angles.length

  const xAvg = stats.x / stats.angles.length
  const yAvg = stats.y / stats.angles.length
  const angleAverage = Math.atan2(yAvg, xAvg) / 2
  stats.angleAverage = 180 / Math.PI * angleAverage
  stats.r = Math.sqrt(Math.pow(xAvg, 2) + Math.pow(yAvg, 2))

  stats.averageRatio = stats.totalRatio / stats.angles.length

  const anglesUrls = await getUrlFromMat(anglesMat)
  return { stats, anglesMat, anglesUrls }
}

async function processRotatedRectForStats(matToDraw, rotatedRect, stats) {
  stats = stats ?? {
    angles: [],
    minAngle: Number.MAX_VALUE,
    maxAngle: -Number.MAX_VALUE,
    x: 0,
    y: 0,

    ratios: [],
    minRatio: Number.MAX_VALUE,
    maxRatio: -Number.MAX_VALUE,
    totalRatio: 0,
  }

  const rawAngle = rotatedRect.angle
  const { width, height } = rotatedRect.size

  const longestSide = Math.max(width, height)
  const shortestSide = Math.min(width, height)

  if (shortestSide === 0) {
    return stats
  }

  await drawRotatedRect(matToDraw, rotatedRect)

  const angle = (width < height) ? rawAngle + 90 : rawAngle
  const ratio = longestSide / shortestSide

  stats.angles.push(angle)
  stats.ratios.push(ratio)

  stats.minAngle = Math.min(stats.minAngle, angle)
  stats.maxAngle = Math.max(stats.maxAngle, angle)
  stats.x += Math.cos((angle - 90) * 2)
  stats.y += Math.sin((angle - 90) * 2)

  stats.minRatio = Math.min(stats.minRatio, ratio)
  stats.maxRatio = Math.max(stats.maxRatio, ratio)
  stats.totalRatio += ratio

  return stats
}

async function drawRotatedRect(matToDraw, rotatedRect) {
  let vertices = cv.RotatedRect.points(rotatedRect)
  for (let i = 0; i < 4; i++) {
    cv.line(matToDraw, vertices[i], vertices[(i + 1) % 4], new cv.Scalar(0, 255, 0, 255), 2, cv.LINE_AA, 0)
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
  return { inputMat: cv.imread(image), name: imageData.blob.name }
}

async function getUrlFromMat(mat) {
  const canvas = document.createElement('canvas')
  cv.imshow(canvas, mat)

  const blob = await new Promise(resolve => canvas.toBlob(resolve))

  return URL.createObjectURL(blob)
}
