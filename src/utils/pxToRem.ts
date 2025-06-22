export const pxToRem = (px?: number | undefined | null) => {
  if (!px) return '0'
  return `${px / 16}rem`
}
