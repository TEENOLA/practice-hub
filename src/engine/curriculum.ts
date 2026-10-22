import { buildFromBank, type BankEntry } from './bank'
import { buildCounting } from './generators/counting'
import { buildPlaceValue } from './generators/placeValue'
import { buildRounding } from './generators/rounding'
import { buildShortDivision } from './generators/shortDivision'
import type { SubjectId, Topic, YearId } from './types'
import englishGrammarP5 from '../content/english-p5-grammar.json'
import scienceForcesP5 from '../content/science-p5-forces.json'

export interface SubjectInfo {
  id: SubjectId
  name: string
  blurb: string
  /** Tailwind classes. Written out in full so Tailwind can find them. */
  headerClass: string
  textClass: string
  softClass: string
}

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'maths',
    name: 'Maths',
    blurb: 'Numbers, calculation, fractions, shapes and measures.',
    headerClass: 'bg-maths',
    textClass: 'text-maths',
    softClass: 'bg-[#e6eeff] text-[#1b3fa0]',
  },
  {
    id: 'english',
    name: 'English',
    blurb: 'Phonics, spelling, grammar and reading.',
    headerClass: 'bg-english',
    textClass: 'text-english',
    softClass: 'bg-[#fdeae6] text-[#8f2a19]',
  },
  {
    id: 'science',
    name: 'Science',
    blurb: 'Plants, animals, materials, forces and the world around us.',
    headerClass: 'bg-science',
    textClass: 'text-science',
    softClass: 'bg-[#e3f4ea] text-[#14582a]',
  },
]

/** Britain's Year numbers sit next to Nigeria's Primary numbers. Edit if your school offsets them. */
export const YEAR_OPTIONS: { id: YearId; label: string; sublabel: string }[] = [
  { id: 0, label: 'Nursery & KG', sublabel: 'Reception' },
  { id: 1, label: 'Primary 1', sublabel: 'Year 1' },
  { id: 2, label: 'Primary 2', sublabel: 'Year 2' },
  { id: 3, label: 'Primary 3', sublabel: 'Year 3' },
  { id: 4, label: 'Primary 4', sublabel: 'Year 4' },
  { id: 5, label: 'Primary 5', sublabel: 'Year 5' },
  { id: 6, label: 'Primary 6', sublabel: 'Year 6' },
]

export const QUIZ_LENGTH = 10
const EARLY_QUIZ_LENGTH = 5

/**
 * Every topic in the app. A topic without `build` shows as "Coming soon".
 * To add content: write a generator (Maths) or a JSON file (anything else)
 * and give the topic a `build`.
 */
export const TOPICS: Topic[] = [
  // ---- Maths · Nursery & KG ----
  {
    id: 'counting',
    subject: 'maths',
    year: 0,
    group: 'Number',
    name: 'Counting to 10',
    blurb: 'Count the things and tap the number.',
    ui: 'early',
    questionCount: EARLY_QUIZ_LENGTH,
    build: buildCounting,
  },
  {
    id: 'shapes',
    subject: 'maths',
    year: 0,
    group: 'Shape',
    name: 'Shapes around us',
    blurb: 'Circles, squares and triangles.',
    ui: 'early',
    questionCount: EARLY_QUIZ_LENGTH,
  },

  // ---- Maths · Primary 5 (Year 5) ----
  {
    id: 'place-value',
    subject: 'maths',
    year: 5,
    group: 'Number and place value',
    name: 'Place value',
    blurb: 'Read, write and compare numbers up to 1,000,000.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
    build: buildPlaceValue,
  },
  {
    id: 'rounding',
    subject: 'maths',
    year: 5,
    group: 'Number and place value',
    name: 'Rounding',
    blurb: 'Round to the nearest 10, 100 and 1,000.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
    build: buildRounding,
  },
  {
    id: 'negative-numbers',
    subject: 'maths',
    year: 5,
    group: 'Number and place value',
    name: 'Negative numbers',
    blurb: 'Count through zero and compare.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'add-subtract',
    subject: 'maths',
    year: 5,
    group: 'Calculation',
    name: 'Add and subtract',
    blurb: 'Written methods and word problems.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'multiply',
    subject: 'maths',
    year: 5,
    group: 'Calculation',
    name: 'Multiply',
    blurb: 'Multiply by 1-digit and 2-digit numbers.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'short-division',
    subject: 'maths',
    year: 5,
    group: 'Calculation',
    name: 'Short division',
    blurb: 'Divide using the bus stop method.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
    build: buildShortDivision,
  },
  {
    id: 'fractions',
    subject: 'maths',
    year: 5,
    group: 'Fractions, decimals and percentages',
    name: 'Fractions',
    blurb: 'Compare, add and subtract fractions.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'decimals',
    subject: 'maths',
    year: 5,
    group: 'Fractions, decimals and percentages',
    name: 'Decimals',
    blurb: 'Tenths, hundredths and thousandths.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'percentages',
    subject: 'maths',
    year: 5,
    group: 'Fractions, decimals and percentages',
    name: 'Percentages',
    blurb: 'Link percentages to fractions and decimals.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'perimeter-area',
    subject: 'maths',
    year: 5,
    group: 'Measures and shape',
    name: 'Perimeter and area',
    blurb: 'Find the distance around and the space inside.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'money-time',
    subject: 'maths',
    year: 5,
    group: 'Measures and shape',
    name: 'Money and time',
    blurb: 'Naira and kobo, and the 24-hour clock.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'angles',
    subject: 'maths',
    year: 5,
    group: 'Measures and shape',
    name: 'Angles',
    blurb: 'Measure, draw and estimate angles.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },

  // ---- English · Primary 5 ----
  {
    id: 'spelling-grammar',
    subject: 'english',
    year: 5,
    group: 'Spelling and grammar',
    name: 'Spelling and grammar',
    blurb: 'Tricky spellings, word types and punctuation.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
    build: (count) => buildFromBank('spelling-grammar', englishGrammarP5 as BankEntry[], count),
  },
  {
    id: 'comprehension',
    subject: 'english',
    year: 5,
    group: 'Reading',
    name: 'Reading comprehension',
    blurb: 'Read a short passage and answer questions.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },

  // ---- Science · Primary 5 ----
  {
    id: 'forces',
    subject: 'science',
    year: 5,
    group: 'Physical processes',
    name: 'Forces',
    blurb: 'Gravity, friction, air and water resistance, levers and gears.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
    build: (count) => buildFromBank('forces', scienceForcesP5 as BankEntry[], count),
  },
  {
    id: 'earth-space',
    subject: 'science',
    year: 5,
    group: 'Physical processes',
    name: 'Earth and space',
    blurb: 'The Sun, Earth and Moon.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
  {
    id: 'living-things',
    subject: 'science',
    year: 5,
    group: 'Living things',
    name: 'Life cycles',
    blurb: 'How plants and animals grow and reproduce.',
    ui: 'standard',
    questionCount: QUIZ_LENGTH,
  },
]

export function getSubject(subjectId: string | undefined): SubjectInfo | undefined {
  return SUBJECTS.find((subject) => subject.id === subjectId)
}

export function getYearOption(yearId: number) {
  return YEAR_OPTIONS.find((option) => option.id === yearId)
}

export function getTopics(subjectId: SubjectId, yearId: YearId): Topic[] {
  return TOPICS.filter((topic) => topic.subject === subjectId && topic.year === yearId)
}

export function getTopic(subjectId: string, yearId: number, topicId: string): Topic | undefined {
  return TOPICS.find(
    (topic) => topic.subject === subjectId && topic.year === yearId && topic.id === topicId,
  )
}
