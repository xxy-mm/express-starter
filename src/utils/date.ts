export const toFormDate = (date: Date) => {
  let day = date.getDate().toString()
  let month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()

  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-')
}
