import { buildOptions } from '../options'
import { formatNumber, makeQuestionId, randomInt, shuffle } from '../random'
import type { Question } from '../types'

const TOPIC_ID = 'place-value'
const PLACE_NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands']

/** A number whose digits are all different, so "the 7" is unambiguous. */
function numberWithDistinctDigits(length: number): number[] {
  let digits: number[]
  do {
    digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, length)
  } while (digits[0] === 0)
  return digits
}

function buildOne(): Question {
  const length = randomInt(5, 6)
  const digits = numberWithDistinctDigits(length)
  const nonZeroPositions = digits
    .map((digit, position) => ({ digit, position }))
    .filter((entry) => entry.digit !== 0)
  const chosen = nonZeroPositions[randomInt(0, nonZeroPositions.length - 1)]

  const placeFromRight = length - 1 - chosen.position
  const placeName = PLACE_NAMES[placeFromRight]
  const value = chosen.digit * 10 ** placeFromRight
  const whole = Number(digits.join(''))

  const pool = [chosen.digit, value * 10, value / 10, value * 100, value * 1000]
    .filter((candidate) => Number.isInteger(candidate) && candidate > 0 && candidate !== value)
    .map(formatNumber)
  const { options, correctOptionId } = buildOptions(formatNumber(value), pool)

  return {
    id: makeQuestionId(TOPIC_ID),
    prompt: `What is the value of the digit ${chosen.digit} in ${formatNumber(whole)}?`,
    options,
    correctOptionId,
    explanation: [
      `The ${chosen.digit} is in the ${placeName} column.`,
      `${chosen.digit} ${placeName} = ${formatNumber(value)}.`,
      `The digit is ${chosen.digit}, but its value is ${formatNumber(value)}.`,
    ],
    hint: 'Count the columns from the right: ones, tens, hundreds, thousands, ten thousands.',
  }
}

export function buildPlaceValue(count: number): Question[] {
  const questions: Question[] = []
  const seenPrompts = new Set<string>()
  for (let attempt = 0; questions.length < count && attempt < count * 20; attempt++) {
    const question = buildOne()
    if (seenPrompts.has(question.prompt)) continue
    seenPrompts.add(question.prompt)
    questions.push(question)
  }
  return questions
}
