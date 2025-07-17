import { days } from '@/../../library/constants/date.constants'

const getNumberOfDays = (year: number, month: number) => {
  return 40 - new Date(year, month, 40).getDate()
}

const getDayDetails = (args: {
  index: number
  firstDay: number
  month: number
  year: number
  numberOfDays: number
}) => {
  let prevMonth = args.month - 1
  let prevYear = args.year

  if (prevMonth < 0) {
    prevMonth = 11
    prevYear--
  }

  const date = args.index - args.firstDay
  const day = args.index % 7
  const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth)
  const _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1
  const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0
  const timestamp = new Date(args.year, args.month, _date).getTime()

  return {
    date: _date,
    day,
    month,
    timestamp,
    dayString: days[day]
  }
}

const getMonthDetails = (year: number, month: number) => {
  let firstDay = new Date(year, month).getDay()
  let numberOfDays = getNumberOfDays(year, month)
  let monthArray = []
  let rows = (firstDay + numberOfDays) / 7
  let currentDay = null
  let index = 0
  let cols = 7

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayDetails({
        index,
        numberOfDays,
        firstDay,
        year,
        month
      })
      monthArray.push(currentDay)
      index++
    }
  }

  return monthArray
}

export { getDayDetails, getMonthDetails, getNumberOfDays }
