export function revokeResults(results) {
  for (const [, value] of Object.entries(results)) {
    for (const url of value) {
      URL.revokeObjectURL(url)
    }
  }
}
