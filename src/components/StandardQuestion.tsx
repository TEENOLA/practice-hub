import type { Question } from '../engine/types'
import { CheckIcon, CrossIcon, SpeakerIcon } from './icons'
import { speak } from './speech'
import { BusStopPicture } from './visuals'

interface StandardQuestionProps {
  question: Question
  pickedOptionId: string | null
  onPick: (optionId: string) => void
  hintOpen: boolean
  onToggleHint: () => void
  nextLabel: string
  onNext: () => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export default function StandardQuestion({
  question,
  pickedOptionId,
  onPick,
  hintOpen,
  onToggleHint,
  nextLabel,
  onNext,
}: StandardQuestionProps) {
  const isAnswered = pickedOptionId !== null
  const gotItRight = pickedOptionId === question.correctOptionId
  const correctOption = question.options.find((option) => option.id === question.correctOptionId)

  return (
    <section className="mt-[22px] rounded-3xl border-[3px] border-line bg-white p-[30px]" aria-labelledby="question-prompt">
      <div className="flex items-start justify-between gap-4">
        <h1 id="question-prompt" className="font-display text-[clamp(24px,3.4vw,32px)] font-semibold leading-snug">
          {question.prompt}
        </h1>
        <button
          type="button"
          onClick={() => speak(question.prompt)}
          aria-label="Read the question aloud"
          className="grid size-12 flex-none cursor-pointer place-items-center rounded-full border-[3px] border-line bg-white text-ink hover:border-[#a9bcd2]"
        >
          <SpeakerIcon className="size-6" />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        {question.visual?.kind === 'bus-stop' && <BusStopPicture visual={question.visual} />}
        {question.hint && (
          <div>
            <button
              type="button"
              aria-expanded={hintOpen}
              onClick={onToggleHint}
              className={`min-h-12 cursor-pointer rounded-[14px] border-[3px] bg-white px-5 py-2.5 text-[17px] font-extrabold ${
                hintOpen ? 'border-ink' : 'border-line'
              }`}
            >
              {hintOpen ? 'Hide the hint' : 'Show a hint'}
            </button>
            {hintOpen && (
              <p className="mt-3 max-w-[40ch] rounded-xl bg-[#fff4d1] px-4 py-3 text-[17px] font-semibold leading-normal">
                {question.hint}
              </p>
            )}
          </div>
        )}
      </div>

      <div role="group" aria-label="Answer choices" className="mt-6 flex flex-wrap gap-3.5">
        {question.options.map((option, position) => {
          const isCorrectOption = option.id === question.correctOptionId
          const isPickedWrong = isAnswered && option.id === pickedOptionId && !isCorrectOption
          const showCorrect = isAnswered && isCorrectOption

          let stateClass = 'border-line bg-white hover:border-[#a9bcd2]'
          if (showCorrect) stateClass = 'border-ok bg-ok-soft'
          else if (isPickedWrong) stateClass = 'border-no bg-no-soft'
          else if (isAnswered) stateClass = 'border-line bg-white opacity-60'

          return (
            <button
              key={option.id}
              type="button"
              disabled={isAnswered}
              onClick={() => onPick(option.id)}
              className={`flex min-h-[76px] min-w-[260px] flex-1 basis-[380px] items-center gap-4 rounded-[18px] border-[3px] px-5 py-3 text-left ${stateClass} ${
                isAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span
                className={`grid size-10 flex-none place-items-center rounded-xl text-lg font-extrabold ${
                  showCorrect ? 'bg-ok text-white' : isPickedWrong ? 'bg-no text-white' : 'bg-[#e9eff6] text-ink'
                }`}
              >
                {showCorrect ? <CheckIcon className="size-[22px]" /> : isPickedWrong ? <CrossIcon className="size-5" /> : LETTERS[position]}
              </span>
              <span className="font-display text-[clamp(20px,2.6vw,30px)] font-semibold leading-tight">{option.label}</span>
              {showCorrect && <span className="ml-auto text-base font-extrabold text-ok">Correct</span>}
              {isPickedWrong && <span className="ml-auto text-base font-extrabold text-no">Not this one</span>}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div role="status" className="mt-6 rounded-[20px] border-[3px] border-line bg-paper px-6 py-[22px]">
          <h2 className="font-display text-[26px] font-semibold">
            {gotItRight ? 'Yes, well done!' : `Not quite. The answer is ${correctOption?.label}.`}
          </h2>
          <ol className="mb-0 mt-3.5 list-decimal space-y-1 pl-6 text-lg leading-relaxed">
            {question.explanation.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <button
            type="button"
            onClick={onNext}
            className="mt-5 inline-flex min-h-14 cursor-pointer items-center rounded-2xl bg-ink px-7 text-[19px] font-extrabold text-white"
          >
            {nextLabel}
          </button>
        </div>
      )}
    </section>
  )
}
