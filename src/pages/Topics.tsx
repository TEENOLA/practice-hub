import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSubject, getTopics, getYearOption } from '../engine/curriculum'
import type { SubjectId, Topic, YearId } from '../engine/types'
import NotFound from './NotFound'

type Mode = 'quiz' | 'practice'

function groupTopics(topics: Topic[]): { name: string; topics: Topic[] }[] {
  const groups: { name: string; topics: Topic[] }[] = []
  for (const topic of topics) {
    const existing = groups.find((group) => group.name === topic.group)
    if (existing) existing.topics.push(topic)
    else groups.push({ name: topic.group, topics: [topic] })
  }
  return groups
}

export default function Topics() {
  const params = useParams()
  const [mode, setMode] = useState<Mode>('quiz')

  const subject = getSubject(params.subject)
  const yearOption = getYearOption(Number(params.year))
  if (!subject || !yearOption) return <NotFound />

  const topics = getTopics(subject.id as SubjectId, yearOption.id as YearId)
  const groups = groupTopics(topics)

  return (
    <>
      <section className={`${subject.headerClass} text-white`}>
        <div className="mx-auto max-w-[1120px] px-6 pb-9 pt-7">
          <nav aria-label="Breadcrumb" className="text-base font-bold">
            <Link to="/" className="text-white/85 no-underline hover:text-white">
              All subjects
            </Link>
            <span className="text-white/85"> / </span>
            <span>{subject.name}</span>
          </nav>
          <div className="mt-3.5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-display text-[clamp(34px,5vw,52px)] font-semibold leading-[1.1]">
                {subject.name} · {yearOption.label}
              </h1>
              <p className="mt-2 text-[19px] text-white/90">{yearOption.sublabel} · pick a topic to begin</p>
            </div>
            <div
              role="group"
              aria-label="How do you want to practise?"
              className="inline-flex rounded-full bg-white/20 p-[5px]"
            >
              {(['quiz', 'practice'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={mode === option}
                  onClick={() => setMode(option)}
                  className={`min-h-12 cursor-pointer rounded-full px-[22px] py-3 text-base font-extrabold capitalize ${
                    mode === option ? 'bg-white text-ink' : 'bg-transparent text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[17px]" role="status">
            {mode === 'quiz'
              ? 'Quiz: answer the questions, then you see your score.'
              : 'Practice: take your time. Hints are on and nothing is scored.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-14 pt-9">
        {groups.length === 0 && (
          <div className="rounded-3xl border-[3px] border-line bg-white p-8 text-center">
            <h2 className="font-display text-2xl font-semibold">Questions for {yearOption.label} are coming soon</h2>
            <p className="mt-2 text-lg text-soft">Try another class, or come back soon.</p>
            <Link
              to="/"
              className="mt-5 inline-flex min-h-14 items-center rounded-2xl bg-ink px-7 text-lg font-extrabold text-white no-underline"
            >
              Choose another class
            </Link>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.name} className="mb-9">
            <h2 className="mb-4 font-display text-[26px] font-semibold">{group.name}</h2>
            <div className="flex flex-wrap gap-4">
              {group.topics.map((topic) => {
                const isReady = Boolean(topic.build)
                const cardClass =
                  'flex min-h-[150px] min-w-[280px] flex-1 flex-col justify-between gap-[18px] rounded-[20px] border-[3px] px-6 py-[22px] text-ink no-underline'
                const inside = (
                  <>
                    <span>
                      <span className="block font-display text-2xl font-semibold leading-tight">{topic.name}</span>
                      <span className="mt-2 block text-[17px] leading-normal text-soft">{topic.blurb}</span>
                    </span>
                    <span className="flex items-center justify-between gap-3">
                      {isReady ? (
                        <>
                          <span className={`rounded-full px-3 py-1 text-[15px] font-extrabold ${subject.softClass}`}>
                            {mode === 'quiz' ? `${topic.questionCount} questions` : 'Hints on'}
                          </span>
                          <span className={`text-[17px] font-extrabold ${subject.textClass}`}>Start →</span>
                        </>
                      ) : (
                        <span className="rounded-full bg-[#e9eff6] px-3 py-1 text-[15px] font-extrabold text-muted">
                          Coming soon
                        </span>
                      )}
                    </span>
                  </>
                )
                return isReady ? (
                  <Link
                    key={topic.id}
                    to={`/quiz/${topic.subject}/${topic.year}/${topic.id}?mode=${mode}`}
                    className={`${cardClass} border-line bg-white hover:border-[#a9bcd2]`}
                  >
                    {inside}
                  </Link>
                ) : (
                  <div key={topic.id} aria-disabled="true" className={`${cardClass} border-dashed border-line bg-[#eef2f7] opacity-80`}>
                    {inside}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
