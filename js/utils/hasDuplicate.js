export const hasDuplicate = (array) => {
  return new Set(array).size !== array.length ? true : false
}