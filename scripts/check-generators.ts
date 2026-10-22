// Runs every available topic many times and checks each question is sound.
// Usage: npm test
import { TOPICS } from '../src/engine/curriculum'
import { shortDivisionWorking } from '../src/engine/generators/shortDivision'
import type { Question } from '../src/engine/types'

const RUNS = 300
let questionsChecked = 0
const failures: string[] = []

function check(topicId: string, question: Question) {
  const labels = question.options.map((option) => option.label)
  const ids = question.options.map((option) => option.id)
  const problems: string[] = []

  if (new Set(labels).size !== labels.length) problems.push('duplicate answer labels')
  if (new Set(ids).size !== ids.length) problems.push('duplicate option ids')
  if (!ids.includes(question.correctOptionId)) problems.push('correct option id is missing')
  if (question.options.length < 3) problems.push('fewer than 3 options')
  if (question.explanation.length === 0) problems.push('no explanation')
  if (!question.prompt.trim()) problems.push('empty prompt')
  if (labels.some((label) => label.includes('NaN') || label.includes('undefined'))) {
    problems.push('bad label text')
  }

  if (problems.length > 0) {
    failures.push(`${topicId}: ${problems.join(', ')} :: ${question.prompt} :: ${labels.join(' | ')}`)
  }
  questionsChecked++
}

for (const topic of TOPICS) {
  if (!topic.build) continue
  for (let run = 0; run < RUNS; run++) {
    let questions: Question[]
    try {
      questions = topic.build(topic.questionCount)
    } catch (error) {
      failures.push(`${topic.id}: generator threw: ${(error as Error).message}`)
      continue
    }
    if (questions.length !== topic.questionCount) {
      failures.push(`${topic.id}: expected ${topic.questionCount} questions, got ${questions.length}`)
    }
    for (const question of questions) check(topic.id, question)
  }
}

// Independent check of short division working across every 3-digit dividend and divisor 2-9.
for (let divisor = 2; divisor <= 9; divisor++) {
  for (let dividend = 100; dividend <= 999; dividend++) {
    const working = shortDivisionWorking(dividend, divisor)
    if (working.quotient !== Math.floor(dividend / divisor) || working.remainder !== dividend % divisor) {
      failures.push(`short division wrong for ${dividend} ÷ ${divisor}`)
    }
  }
}

console.log(`Checked ${questionsChecked} questions across ${TOPICS.filter((t) => t.build).length} topics.`)
if (failures.length > 0) {
  console.error(`${failures.length} problem(s):`)
  failures.slice(0, 20).forEach((failure) => console.error(' -', failure))
  process.exit(1)
}
console.log('All questions passed.')
