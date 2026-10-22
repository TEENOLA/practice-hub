import { buildOptions } from './options'
import { makeQuestionId, shuffle } from './random'
import type { Question } from './types'

/**
 * How a hand-written question looks in the JSON files. A teacher only fills
 * in the right answer and three wrong ones; the app shuffles them.
 */
export interface BankEntry {
  prompt: string
  answer: string
  wrong: string[]
  explanation: string[]
  hint?: string
}

export function buildFromBank(topicId: string, entries: BankEntry[], count: number): Question[] {
  const picked: BankEntry[] = []
  while (picked.length < count) {
    picked.push(...shuffle(entries).slice(0, count - picked.length))
  }

  return picked.map((entry) => {
    const { options, correctOptionId } = buildOptions(entry.answer, entry.wrong)
    return {
      id: makeQuestionId(topicId),
      prompt: entry.prompt,
      options,
      correctOptionId,
      explanation: entry.explanation,
      hint: entry.hint,
    }
  })
}
