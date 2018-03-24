export const safeJsonParse = (str) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}
