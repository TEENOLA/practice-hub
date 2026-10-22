export type SubjectId = 'maths' | 'english' | 'science'

/** 0 = Nursery & KG (Reception), 1 to 6 = Primary 1 to 6 (Year 1 to 6). */
export type YearId = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface AnswerOption {
  id: string
  label: string
}

export type QuestionVisual =
  | { kind: 'bus-stop'; dividend: number; divisor: number }
  | { kind: 'objects'; item: 'mango' | 'star' | 'ball'; count: number }

export interface Question {
  id: string
  prompt: string
  options: AnswerOption[]
  correctOptionId: string
  /** Shown after answering, one line per step. */
  explanation: string[]
  hint?: string
  visual?: QuestionVisual
}

export interface Topic {
  id: string
  subject: SubjectId
  year: YearId
  group: string
  name: string
  blurb: string
  /** 'early' = big picture-based screen with audio and retries (Nursery to P2). */
  ui: 'standard' | 'early'
  questionCount: number
  /** Leave undefined for topics that are listed but not written yet. */
  build?: (count: number) => Question[]
}

export interface AnswerRecord {
  question: Question
  chosenOptionId: string
  correct: boolean
}
