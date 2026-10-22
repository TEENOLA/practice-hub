import { Link } from 'react-router-dom'
import type { AnswerRecord } from '../engine/types'
import { CheckIcon, CrossIcon, StarIcon } from './icons'

interface ResultsProps {
  answers: AnswerRecord[]
  topicsPath: string
  onTryNewQuestions: () => void
  onRetryMissed: () => void
}

const CIRCUMFERENCE = 2 * Math.PI * 56

function messageFor(correctCount: number, total: number): { title: string; text: string } {
  const share = correctCount / total
  if (share === 1) return { title: 'Perfect score!', text: `You got every question right. Brilliant.` }
  if (share >= 0.8) return { title: 'Great work!', text: `You got ${correctCount} questions right. Look at the ones you missed, then try them again.` }
  if (share >= 0.5) return { title: 'Good effort!', text: `You got ${correctCount} questions right. Read how the others work, then have another go.` }
  return { title: 'Keep practising!', text: 'This topic is tricky. Read each explanation below, then try again. You will get better every time.' }
}

export default function Results({ answers, topicsPath, onTryNewQuestions, onRetryMissed }: ResultsProps) {
  const total = answers.length
  const correctCount = answers.filter((answer) => answer.correct).length
  const missed = answers.filter((answer) => !answer.correct)
  const message = messageFor(correctCount, total)
  const filledLength = (correctCount / total) * CIRCUMFERENCE

  return (
    <>
      <section className="mt-9 rounded-[26px] border-[3px] border-line bg-white px-[30px] py-[34px] text-center" aria-labelledby="score-heading">
        <div className="relative inline-block size-[180px]" role="img" aria-label={`Score: ${correctCount} out of ${total}`}>
          <svg width="180" height="180" viewBox="0 0 140 140" aria-hidden="true">
            <circle cx="70" cy="70" r="56" fill="none" stroke="#e3eaf3" strokeWidth="14" />
            <circle
              cx="70"
              cy="70"
              r="56"
              fill="none"
              stroke="#2457d6"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${filledLength} ${CIRCUMFERENCE - filledLength}`}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[64px] font-bold leading-none">{correctCount}</span>
            <span className="text-base font-extrabold text-muted">out of {total}</span>
          </div>
        </div>

        <h1 id="score-heading" className="mt-[18px] font-display text-[clamp(30px,4.4vw,42px)] font-semibold">
          {message.title}
        </h1>
        <p className="mx-auto mt-2 max-w-[44ch] text-[19px] leading-normal text-soft">{message.text}</p>

        <div className="mt-5 flex flex-wrap justify-center gap-2" role="img" aria-label={`${correctCount} of ${total} stars earned`}>
          {answers.map((answer, position) => (
            <StarIcon key={position} filled={answer.correct} className="size-[38px]" />
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {missed.length > 0 && (
            <button
              type="button"
              onClick={onRetryMissed}
              className="inline-flex min-h-14 cursor-pointer items-center rounded-2xl bg-ink px-7 text-lg font-extrabold text-white"
            >
              Try the {missed.length === 1 ? 'missed question' : `${missed.length} missed questions`} again
            </button>
          )}
          <button
            type="button"
            onClick={onTryNewQuestions}
            className={`inline-flex min-h-14 cursor-pointer items-center rounded-2xl px-7 text-lg font-extrabold ${
              missed.length > 0 ? 'border-[3px] border-line bg-white text-ink' : 'bg-ink text-white'
            }`}
          >
            New questions
          </button>
          <Link
            to={topicsPath}
            className="inline-flex min-h-14 items-center rounded-2xl border-[3px] border-line bg-white px-7 text-lg font-extrabold text-ink no-underline"
          >
            Choose another topic
          </Link>
        </div>
      </section>

      {missed.length > 0 && (
        <section className="mt-9" aria-labelledby="review-heading">
          <h2 id="review-heading" className="mb-4 font-display text-[26px] font-semibold">
            Questions to look at again
          </h2>
          <div className="flex flex-col gap-4">
            {missed.map((answer) => {
              const chosen = answer.question.options.find((option) => option.id === answer.chosenOptionId)
              const right = answer.question.options.find((option) => option.id === answer.question.correctOptionId)
              return (
                <article key={answer.question.id} className="rounded-xl border-[3px] border-line bg-white px-6 py-[22px] [border-radius:20px]">
                  <p className="m-0 font-display text-2xl font-semibold leading-snug">{answer.question.prompt}</p>
                  <div className="mt-3.5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-no-soft px-3.5 py-2 text-[17px] font-extrabold text-[#8f1d17]">
                      <CrossIcon className="size-4 text-no" />
                      You chose {chosen?.label}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-xl bg-ok-soft px-3.5 py-2 text-[17px] font-extrabold text-[#14582a]">
                      <CheckIcon className="size-4 text-ok" />
                      Answer: {right?.label}
                    </span>
                  </div>
                  <ol className="mb-0 mt-3.5 list-decimal space-y-1 pl-6 text-lg leading-relaxed">
                    {answer.question.explanation.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <p className="mt-7 text-center text-base text-muted">Your score is not saved. Take the quiz again any time for new questions.</p>
    </>
  )
}
