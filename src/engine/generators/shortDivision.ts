import { buildOptions, numericDistractors } from '../options'
import { formatNumber, makeQuestionId, pickOne, randomInt, shuffle } from '../random'
import type { Question } from '../types'

const TOPIC_ID = 'short-division'

export interface DivisionWorking {
  quotient: number
  remainder: number
  steps: string[]
}

/** Works through the bus stop method digit by digit and explains each step. */
export function shortDivisionWorking(dividend: number, divisor: number): DivisionWorking {
  const digits = String(dividend).split('').map(Number)
  const quotientDigits: number[] = []
  const steps: string[] = []
  let carried = 0

  digits.forEach((digit, position) => {
    const current = carried * 10 + digit
    const quotientDigit = Math.floor(current / divisor)
    const leftOver = current % divisor
    const isLastDigit = position === digits.length - 1

    const opening =
      position === 0
        ? `Start with ${digit}.`
        : carried > 0
          ? `The carried ${carried} and the ${digit} make ${current}.`
          : `Bring down the ${digit}.`
    const sum = `${current} ÷ ${divisor} = ${quotientDigit}${leftOver > 0 ? ` remainder ${leftOver}` : ''}.`

    let carryNote = ''
    if (!isLastDigit && leftOver > 0) {
      carryNote =
        quotientDigit === 0 && position === 0
          ? ` ${digit} is too small to share, so carry it.`
          : ` Carry the ${leftOver}.`
    }

    steps.push(`${opening} ${sum}${carryNote}`)
    quotientDigits.push(quotientDigit)
    carried = leftOver
  })

  const quotient = Number(quotientDigits.join(''))
  const remainder = carried

  if (quotient * divisor + remainder !== dividend) {
    throw new Error(`Short division working is wrong for ${dividend} ÷ ${divisor}`)
  }

  return { quotient, remainder, steps }
}

function answerLabel(quotient: number, remainder: number): string {
  return remainder > 0 ? `${formatNumber(quotient)} r ${remainder}` : formatNumber(quotient)
}

function finalStep(dividend: number, divisor: number, working: DivisionWorking): string {
  const { quotient, remainder } = working
  const result = remainder > 0 ? `${quotient} remainder ${remainder}` : String(quotient)
  const check = `${quotient} × ${divisor}${remainder > 0 ? ` + ${remainder}` : ''} = ${dividend}`
  return `So ${dividend} ÷ ${divisor} = ${result}. Check: ${check}.`
}

function exactDividend(divisor: number): number {
  return divisor * randomInt(Math.ceil(100 / divisor), Math.floor(999 / divisor))
}

function plainQuestion(withRemainder: boolean): Question {
  const divisor = randomInt(2, 9)
  let dividend = exactDividend(divisor)
  if (withRemainder) {
    do {
      dividend = randomInt(100, 999)
    } while (dividend % divisor === 0)
  }

  const working = shortDivisionWorking(dividend, divisor)
  const { quotient, remainder } = working
  const quotientText = String(quotient)

  let pool: string[]
  if (withRemainder) {
    const otherRemainders = Array.from({ length: divisor - 1 }, (_, index) => index + 1).filter(
      (candidate) => candidate !== remainder,
    )
    pool = [
      String(quotient),
      `${quotient + 1} r ${remainder}`,
      `${quotient - 1} r ${remainder}`,
      `${quotient} r ${divisor}`,
      ...otherRemainders.map((other) => `${quotient} r ${other}`),
    ]
  } else {
    const droppedZero = quotientText.includes('0') ? Number(quotientText.replace('0', '')) : 0
    const reversed = Number(quotientText.split('').reverse().join(''))
    pool = numericDistractors(quotient, [droppedZero, reversed])
  }

  const { options, correctOptionId } = buildOptions(answerLabel(quotient, remainder), pool)
  const firstPart =
    Number(String(dividend)[0]) >= divisor ? Number(String(dividend)[0]) : Number(String(dividend).slice(0, 2))

  return {
    id: makeQuestionId(TOPIC_ID),
    prompt: withRemainder
      ? `Work out ${dividend} ÷ ${divisor}. Give your answer with a remainder.`
      : `Work out ${dividend} ÷ ${divisor}.`,
    options,
    correctOptionId,
    explanation: [...working.steps, finalStep(dividend, divisor, working)],
    hint: `Start on the left. How many ${divisor}s fit into ${firstPart}?`,
    visual: { kind: 'bus-stop', dividend, divisor },
  }
}

const SHARE_ITEMS = ['exercise books', 'pencils', 'oranges', 'stickers']
const SHARE_GROUPS = [
  { singular: 'class', plural: 'classes' },
  { singular: 'team', plural: 'teams' },
  { singular: 'table', plural: 'tables' },
]

function shareQuestion(): Question {
  const divisor = randomInt(2, 9)
  const dividend = exactDividend(divisor)
  const item = pickOne(SHARE_ITEMS)
  const group = pickOne(SHARE_GROUPS)
  const working = shortDivisionWorking(dividend, divisor)
  const { options, correctOptionId } = buildOptions(
    formatNumber(working.quotient),
    numericDistractors(working.quotient),
  )

  return {
    id: makeQuestionId(TOPIC_ID),
    prompt: `The school has ${dividend} ${item}. They are shared equally between ${divisor} ${group.plural}. How many ${item} does each ${group.singular} get?`,
    options,
    correctOptionId,
    explanation: [
      'Sharing equally means divide.',
      ...working.steps,
      `Each ${group.singular} gets ${working.quotient} ${item}.`,
    ],
    hint: 'Sharing equally means divide. Use short division.',
  }
}

function roundUpQuestion(): Question {
  const seats = pickOne([6, 7, 8, 9])
  const pupils = seats * randomInt(5, 20) + randomInt(1, seats - 1)
  const working = shortDivisionWorking(pupils, seats)
  const answer = working.quotient + 1
  const { options, correctOptionId } = buildOptions(
    formatNumber(answer),
    numericDistractors(answer, [working.quotient, working.quotient + 2]),
  )

  return {
    id: makeQuestionId(TOPIC_ID),
    prompt: `${pupils} pupils are going on a trip. Each bus carries ${seats} pupils. How many buses are needed?`,
    options,
    correctOptionId,
    explanation: [
      ...working.steps,
      `${pupils} ÷ ${seats} = ${working.quotient} remainder ${working.remainder}.`,
      `The pupils left over still need a seat, so round up to ${answer} buses.`,
    ],
    hint: 'Do the division first. Then think: what happens to the pupils who are left over?',
  }
}

const PACKING = [
  { item: 'buns', box: 'box', boxes: 'boxes' },
  { item: 'oranges', box: 'bag', boxes: 'bags' },
  { item: 'pencils', box: 'pack', boxes: 'packs' },
]

function roundDownQuestion(): Question {
  const size = pickOne([4, 5, 6, 8])
  const total = size * randomInt(8, 30) + randomInt(1, size - 1)
  const packing = pickOne(PACKING)
  const working = shortDivisionWorking(total, size)
  const { options, correctOptionId } = buildOptions(
    formatNumber(working.quotient),
    numericDistractors(working.quotient, [working.quotient + 1]),
  )

  return {
    id: makeQuestionId(TOPIC_ID),
    prompt: `A shop has ${total} ${packing.item}. They are packed ${size} to a ${packing.box}. How many full ${packing.boxes} can be made?`,
    options,
    correctOptionId,
    explanation: [
      ...working.steps,
      `${total} ÷ ${size} = ${working.quotient} remainder ${working.remainder}.`,
      `The ${working.remainder} left over are not enough to fill another ${packing.box}, so they are not counted. The answer is ${working.quotient}.`,
    ],
    hint: 'Do the division first. Can the leftover fill a whole one?',
  }
}

type Kind = 'plain-exact' | 'plain-remainder' | 'share' | 'round-up' | 'round-down'

function buildOne(kind: Kind): Question {
  switch (kind) {
    case 'plain-exact':
      return plainQuestion(false)
    case 'plain-remainder':
      return plainQuestion(true)
    case 'share':
      return shareQuestion()
    case 'round-up':
      return roundUpQuestion()
    case 'round-down':
      return roundDownQuestion()
  }
}

const KIND_MIX: Kind[] = [
  'plain-exact',
  'plain-exact',
  'plain-exact',
  'plain-remainder',
  'plain-remainder',
  'plain-remainder',
  'share',
  'round-up',
  'round-down',
  'round-up',
]

export function buildShortDivision(count: number): Question[] {
  const questions: Question[] = []
  const seenPrompts = new Set<string>()
  const kinds = shuffle(KIND_MIX)

  for (let position = 0; questions.length < count && position < count * 20; position++) {
    const question = buildOne(kinds[position % kinds.length])
    if (seenPrompts.has(question.prompt)) continue
    seenPrompts.add(question.prompt)
    questions.push(question)
  }
  return questions
}
