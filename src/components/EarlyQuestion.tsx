import type { Question } from '../engine/types'
import { CheckIcon, SpeakerIcon } from './icons'
import { speak } from './speech'
import { ObjectsPicture } from './visuals'

interface EarlyQuestionProps {
  question: Question
  /** The correct option, once the child has found it. */
  pickedOptionId: string | null
  /** Wrong taps so far on this question. They stay amber and can be tapped again. */
  wrongOptionIds: string[]
  onPick: (optionId: string) => void
  nextLabel: string
  onNext: () => void
}

export default function EarlyQuestion({
  question,
  pickedOptionId,
  wrongOptionIds,
  onPick,
  nextLabel,
  onNext,
}: EarlyQuestionProps) {
  const isDone = pickedOptionId !== null
  const hasTriedWrong = wrongOptionIds.length > 0

  return (
    <section className="mx-auto mt-5 flex max-w-[460px] flex-col gap-3.5" aria-labelledby="early-prompt">
      {question.visual?.kind === 'objects' && <ObjectsPicture visual={question.visual} />}

      <div className="flex items-center justify-between gap-3">
        <h1 id="early-prompt" className="font-display text-[30px] font-semibold leading-tight">
          {question.prompt}
        </h1>
        <button
          type="button"
          onClick={() => speak(question.prompt)}
          aria-label="Hear the question"
          className="grid size-16 flex-none cursor-pointer place-items-center rounded-full bg-maths text-white"
        >
          <SpeakerIcon className="size-8" />
        </button>
      </div>

      <div role="group" aria-label="Answer choices" className="flex flex-col gap-3">
        {question.options.map((option) => {
          const isRight = isDone && option.id === pickedOptionId
          const isWrong = !isDone && wrongOptionIds.includes(option.id)
          let stateClass = 'border-line bg-white'
          if (isRight) stateClass = 'border-ok bg-ok-soft'
          else if (isWrong) stateClass = 'border-retry bg-retry-soft'
          return (
            <button
              key={option.id}
              type="button"
              disabled={isDone}
              onClick={() => onPick(option.id)}
              className={`flex h-[84px] cursor-pointer items-center justify-center gap-3.5 rounded-[22px] border-4 font-display text-[46px] font-semibold ${stateClass} ${
                isDone ? 'cursor-default' : ''
              }`}
            >
              {option.label}
              {isRight && <CheckIcon className="size-[34px] text-ok" />}
            </button>
          )
        })}
      </div>

      <div role="status" className="min-h-[84px]">
        {isDone && (
          <div className="flex items-center justify-between gap-3 rounded-[22px] bg-ink px-[18px] py-3 text-white">
            <span className="font-display text-[26px] font-semibold">
              {hasTriedWrong ? 'You got it!' : 'Well done!'}
            </span>
            <button
              type="button"
              onClick={onNext}
              className="min-h-[52px] cursor-pointer rounded-2xl bg-star px-[22px] text-xl font-extrabold text-ink"
            >
              {nextLabel}
            </button>
          </div>
        )}
        {!isDone && hasTriedWrong && (
          <p className="m-0 rounded-[22px] bg-retry-soft px-[18px] py-5 font-display text-2xl font-semibold">
            Count them again, then try another.
          </p>
        )}
      </div>
    </section>
  )
}
