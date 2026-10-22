import { formatNumber, shuffle } from './random'
import type { AnswerOption } from './types'

export interface BuiltOptions {
  options: AnswerOption[]
  correctOptionId: string
}

/**
 * Builds shuffled answer options. The distractor pool can hold duplicates or
 * the correct answer: both are removed. Throws if there are not enough
 * distinct wrong answers, so a bad generator fails loudly in tests.
 */
export function buildOptions(
  correctLabel: string,
  distractorPool: string[],
  distractorCount = 3,
): BuiltOptions {
  const seenLabels = new Set([correctLabel])
  const distractors: string[] = []

  for (const candidate of shuffle(distractorPool)) {
    if (seenLabels.has(candidate)) continue
    seenLabels.add(candidate)
    distractors.push(candidate)
    if (distractors.length === distractorCount) break
  }

  if (distractors.length < distractorCount) {
    throw new Error(`Not enough distinct wrong answers for "${correctLabel}"`)
  }

  const options: AnswerOption[] = shuffle([correctLabel, ...distractors]).map(
    (label, position) => ({ id: `option-${position}`, label }),
  )
  const correctOption = options.find((option) => option.label === correctLabel)
  if (!correctOption) throw new Error('Correct option went missing')

  return { options, correctOptionId: correctOption.id }
}

/** Near misses around a number, as formatted labels. Extras are tried too. */
export function numericDistractors(correct: number, extras: number[] = []): string[] {
  const candidates = [
    ...extras,
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2,
    correct + 10,
    correct - 10,
  ]
  return candidates
    .filter((value) => Number.isInteger(value) && value > 0 && value !== correct)
    .map(formatNumber)
}
