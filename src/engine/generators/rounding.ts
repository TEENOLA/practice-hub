import { buildOptions } from '../options'
import { formatNumber, makeQuestionId, pickOne, randomInt } from '../random'
import type { Question } from '../types'

const TOPIC_ID = 'rounding'
const PLACE_NAMES: Record<number, string> = { 1: 'ones', 10: 'tens', 100: 'hundreds', 1000: 'thousands' }

function roundTo(value: number, place: number): number {
  return Math.round(value / place) * place
}

function buildOne(): Question {
  const place = pickOne([10, 100, 1000])
  let value = 0
  do {
    value = randomInt(1000, 99999)
  } while (value % place === 0)

  const answer = roundTo(value, place)
  const belowPlace = place / 10
  const decidingDigit = Math.floor((value % place) / belowPlace)
  const roundsUp = decidingDigit >= 5

  const roundedDown = value - (value % place)
  const roundedUp = roundedDown + place
  const pool = [
    roundsUp ? roundedDown : roundedUp,
    roundTo(value, place * 10),
    roundTo(value, belowPlace),
    answer + place,
    answer - place,
    answer + place * 2,
    answer + place * 10,
  ]
    .filter((candidate) => candidate > 0 && candidate !== answer)
    .map(formatNumber)
  const { options, correctOptionId } = buildOptions(formatNumber(answer), pool)

  return {
    id: makeQuestionId(TOPIC_ID),
    prompt: `Round ${formatNumber(value)} to the nearest ${formatNumber(place)}.`,
    options,
    correctOptionId,
    explanation: [
      `Look at the ${PLACE_NAMES[belowPlace]} digit, the one just to the right: it is ${decidingDigit}.`,
      roundsUp
        ? `${decidingDigit} is 5 or more, so round up.`
        : `${decidingDigit} is less than 5, so round down.`,
      `${formatNumber(value)} rounds to ${formatNumber(answer)}.`,
    ],
    hint: `Find the digit just to the right of the ${formatNumber(place)} column. 5 or more rounds up.`,
  }
}

export function buildRounding(count: number): Question[] {
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
