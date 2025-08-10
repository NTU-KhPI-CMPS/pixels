import { useMemo } from 'react'

export function useHistogram(data, dataFieldName, minFieldName, maxFieldName) {
  return useMemo(() => {
    if (!data || !data.length) {
      return
    }

    const header = generateHeader(data)
    const buckets = generateBuckets(data, minFieldName, maxFieldName)

    fillBuckets(buckets, data, dataFieldName)

    return [header, ...buckets]
  }, [data, dataFieldName, minFieldName, maxFieldName])
}

function generateBuckets(data, minFieldName, maxFieldName) {
  const min = Math.min(...data.map(data => data[minFieldName]))
  const max = Math.max(...data.map(data => data[maxFieldName]))

  const step = (max - min) / 10
  const areaHistogram = Array.from({ length: 10 }, () => Array(data.length + 1).fill(0))

  for (let i = 0; i < 10; i++) {
    const start = Math.round(min + i * step)
    areaHistogram[i][0] = i === 9 ? max : Math.round(start + step)
  }

  return areaHistogram
}

function fillBuckets(buckets, data, dataFieldName) {
  for (let i = 0; i < data.length; i++) {
    let bucketIndex = 0
    let rangeEnd = buckets[bucketIndex][0]

    for (let j = 0; j < data[i][dataFieldName].length; j++) {
      while (data[i][dataFieldName][j] > rangeEnd) {
        bucketIndex++
        rangeEnd = buckets[bucketIndex][0]
      }
      buckets[bucketIndex][i + 1]++
    }
  }
}

function generateHeader(data) {
  let header = ['Value']
  for (let i = 0; i < data.length; i++) {
    header.push(data[i].name)
  }
  return header
}
