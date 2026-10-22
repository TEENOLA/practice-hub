import { buildOptions } from '../options'
import { makeQuestionId, pickOne, shuffle } from '../random'
import type { Question } from '../types'

const TOPIC_ID = 'counting'
const ITEMS = [
  { item: 'mango', plural: 'mangoes' },
  { item: 'star', plural: 'stars' },
  { item: 'ball', plural: 'balls' },
] as const

export function buildCounting(count: number): Question[] {
  const counts = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, count)

  return counts.map((total) => {
    const thing = pickOne(ITEMS)
    const pool = [total - 1, total + 1, total - 2, total + 2]
      .filter((candidate) => candidate >= 1 && candidate <= 10)
      .map(String)
    const { options, correctOptionId } = buildOptions(String(total), pool, 2)
    // Early years children find ascending answers easier to scan.
    options.sort((first, second) => Number(first.label) - Number(second.label))

    return {
      id: makeQuestionId(TOPIC_ID),
      prompt: `How many ${thing.plural}?`,
      options,
      correctOptionId,
      explanation: [`Count them one at a time. There are ${total} ${thing.plural}.`],
      hint: 'Touch each one as you count.',
      visual: { kind: 'objects', item: thing.item, count: total },
    }
  })
}
