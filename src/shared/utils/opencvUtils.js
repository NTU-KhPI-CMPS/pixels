import { getImage } from './indexedDBUtils.js'

export async function getResult(id) {
  await window.opencvLoaded

  const images = []
  const stats = []
  const inputData = await getMatFromDb(id)

  const binaryData = await binarize(inputData.mat)
  images.push(binaryData.url)
  stats.push({ ...binaryData.stats, name: inputData.name })

  const cannyData = await canny(binaryData.binaryMat)
  binaryData.binaryMat.delete()
  images.push(cannyData.url)

  const contoursData = await contours(cannyData.closedMat)
  cannyData.closedMat.delete()
  stats.push({ ...contoursData.stats, name: inputData.name })

  const drawnContours = await drawContours(inputData.mat, contoursData.filteredContours)
  contoursData.filteredContours.delete()
  images.push(drawnContours.url)

  inputData.mat.delete()
  return [images, stats]
}

async function binarize(input) {
  let gray = new cv.Mat()
  cv.cvtColor(input, gray, cv.COLOR_RGBA2GRAY)

  let binaryMat = new cv.Mat()
  cv.adaptiveThreshold(gray, binaryMat, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 49, 12)
  gray.delete()

  const stats = await getBinaryStats(input, binaryMat)
  const url = await getUrlFromMat(binaryMat)

  return { url, stats, binaryMat }
}

async function canny(input) {
  let canny = new cv.Mat()
  cv.Canny(input, canny, 25, 50)

  let closedMat = new cv.Mat()
  let kernel = cv.Mat.ones(6, 6, cv.CV_8U)
  cv.morphologyEx(canny, closedMat, cv.MORPH_CLOSE, kernel)
  kernel.delete()
  canny.delete()

  const url = await getUrlFromMat(closedMat)
  return { url, closedMat }
}

async function contours(input) {
  let contours = new cv.MatVector()
  cv.findContours(input, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_KCOS)

  let filteredContours = new cv.MatVector()
  for (let i = 0; i < contours.size(); ++i) {
    let contour = contours.get(i)
    if (cv.contourArea(contour) > 1) {
      filteredContours.push_back(contour)
    }
  }
  contours.delete()

  const stats = await getContoursStats(input, filteredContours)
  return { stats, filteredContours }
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

async function getContoursStats(original, contours) {
  const count = contours.size()

  let totalArea = 0
  let minArea = Number.MAX_VALUE
  let maxArea = -Number.MAX_VALUE

  let totalPerimeter = 0
  let minPerimeter = Number.MAX_VALUE
  let maxPerimeter = -Number.MAX_VALUE

  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i)
    const area = cv.contourArea(contour)
    totalArea += area
    minArea = Math.min(minArea, area)
    maxArea = Math.max(maxArea, area)

    const perimeter = cv.arcLength(contour, true)
    totalPerimeter += perimeter
    minPerimeter = Math.min(minPerimeter, perimeter)
    maxPerimeter = Math.max(maxPerimeter, perimeter)
  }

  const averageArea = totalArea / count
  const averagePerimeter = totalPerimeter / count
  const size = original.size()
  const imageArea = size.width * size.height
  const percentage = (totalArea / imageArea) * 100.0

  return {
    count, percentage, totalArea, minArea, averageArea, maxArea,
    totalPerimeter, minPerimeter, averagePerimeter, maxPerimeter,
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
