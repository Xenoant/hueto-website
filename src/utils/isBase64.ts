export const isBase64 = (str: string): boolean => {
  try {
    return btoa(atob(str)) === str
  } catch {
    return false
  }
}
