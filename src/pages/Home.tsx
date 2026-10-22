import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SubjectIcon } from '../components/icons'
import { SUBJECTS, YEAR_OPTIONS, getYearOption } from '../engine/curriculum'
import type { YearId } from '../engine/types'

const STORAGE_KEY = 'practice-hub-year'
const DEFAULT_YEAR: YearId = 5

function readSavedYear(): YearId {
  try {
    const saved = Number(window.sessionStorage.getItem(STORAGE_KEY))
    if (getYearOption(saved)) return saved as YearId
  } catch {
    // Storage can be blocked. The page works without it.
  }
  return DEFAULT_YEAR
}

const HOW_IT_WORKS = [
  { title: 'Pick a topic', text: 'Every topic matches what you learn in class.' },
  { title: 'Answer the questions', text: 'One at a time. Stuck? Tap Hint. Every answer explains why.' },
  { title: 'Get your score', text: 'Look back at what you missed, then try those again.' },
]

export default function Home() {
  const [year, setYear] = useState<YearId>(readSavedYear)
  const currentYear = getYearOption(year)

  function chooseYear(nextYear: YearId) {
    setYear(nextYear)
    try {
      window.sessionStorage.setItem(STORAGE_KEY, String(nextYear))
    } catch {
      // Ignore: remembering the class is only a convenience.
    }
  }

  return (
    <>
      <section className="mx-auto max-w-[1120px] px-6 pb-2 pt-14">
        <p className="mb-2.5 text-[15px] font-extrabold uppercase tracking-[0.12em] text-muted">
          Practise · Learn · Score
        </p>
        <h1 className="max-w-[15ch] font-display text-[clamp(36px,5.2vw,60px)] font-semibold leading-[1.08]">
          What shall we practise today?
        </h1>
        <p className="mt-4 max-w-[52ch] text-xl leading-relaxed text-soft">
          Choose your class and a subject, answer the questions one at a time, and see your score at the end. No
          sign-in needed.
        </p>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-2 pt-8" aria-labelledby="year-heading">
        <h2 id="year-heading" className="mb-3.5 font-display text-2xl font-semibold">
          I am in
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {YEAR_OPTIONS.map((option) => {
            const isSelected = option.id === year
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => chooseYear(option.id)}
                className={`min-h-[60px] min-w-28 cursor-pointer rounded-2xl border-[3px] px-[18px] py-2 text-left ${
                  isSelected ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-[#a9bcd2]'
                }`}
              >
                <span className="block text-[17px] font-extrabold">{option.label}</span>
                <span className={`block text-sm font-semibold ${isSelected ? 'text-[#c9d8ea]' : 'text-muted'}`}>
                  {option.sublabel}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3.5 text-base text-muted" role="status">
          Showing subjects for {currentYear?.label} ({currentYear?.sublabel}).
        </p>
      </section>

      <section id="subjects" className="mx-auto max-w-[1120px] px-6 pb-2 pt-8" aria-labelledby="subject-heading">
        <h2 id="subject-heading" className="mb-[18px] font-display text-2xl font-semibold">
          Choose a subject
        </h2>
        <div className="flex flex-wrap gap-5">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              to={`/${subject.id}/${year}`}
              className="flex min-w-[280px] flex-1 flex-col overflow-hidden rounded-[22px] border-[3px] border-line bg-white text-ink no-underline"
            >
              <span className={`flex items-center gap-4 px-6 py-[22px] text-white ${subject.headerClass}`}>
                <SubjectIcon subject={subject.id} className="size-[52px]" />
                <span className="font-display text-[34px] font-semibold">{subject.name}</span>
              </span>
              <span className="block px-6 pb-6 pt-5">
                <span className="block text-lg leading-normal text-soft">{subject.blurb}</span>
                <span className={`mt-4 block text-lg font-extrabold ${subject.textClass}`}>Start practising →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-14 pt-12" aria-labelledby="how-heading">
        <h2 id="how-heading" className="mb-[18px] font-display text-2xl font-semibold">
          How it works
        </h2>
        <ol className="m-0 flex list-none flex-wrap gap-4 p-0">
          {HOW_IT_WORKS.map((step, index) => (
            <li
              key={step.title}
              className="flex min-w-[260px] flex-1 items-start gap-4 rounded-[18px] border-2 border-line bg-white p-5"
            >
              <span className="grid size-11 flex-none place-items-center rounded-full bg-ink font-display text-[22px] font-semibold text-white">
                {index + 1}
              </span>
              <span>
                <b className="block text-lg">{step.title}</b>
                <span className="mt-1 block text-base leading-normal text-soft">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
