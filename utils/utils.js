export const getRange = (min, max) => {
  'worklet'
  return Math.random() * (max - min) + min
}

export const generateRandomNumbersArr = (
  skipNumbers = [],
  min = 2,
  max = 30,
  maxLength = 10
) => {
  'worklet'
  const numbers = []
  for (let i = min; i <= max; i++) {
    numbers.push(i)
  }
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }
  const filteredNumbers = numbers.filter(
    (number) => !skipNumbers.includes(number)
  )
  return filteredNumbers.slice(0, maxLength).sort((a, b) => a - b)
}

export const truncateString = (str, num) => {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}
