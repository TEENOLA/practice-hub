import { useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import EarlyQuestion from '../components/EarlyQuestion'
import { BackIcon, StarIcon } from '../components/icons'
import Results from '../components/Results'
import { stopSpeaking } from '../components/speech'
import StandardQuestion from '../components/StandardQuestion'
import { siteConfig } from '../config'
import { getTopic, getYearOption } from '../engine/curriculum'
import type { AnswerRecord, Question, Topic } from '../engine/types'

type Mode = 'quiz' | 'practice'

interface QuizSessionProps {
  topic: Topic
  mode: Mode
  initialQuestions: Question[]
  topicsPath: string
  yearLabel: string
  onRestart: (questions?: Question[]) => void
}

function QuizSession({ topic, mode, initialQuestions, topicsPath, yearLabel, onRestart }: QuizSessionProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [position, setPosition] = useState(0)
  const [pickedOptionId, setPickedOptionId] = useState<string | null>(null)
  const [wrongOptionIds, setWrongOptionIds] = useState<string[]>([])
  const [hintOpen, setHintOpen] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const isEarly = topic.ui === 'early'
  const currentQuestion = questions[position]
  const isLastQuestion = position === questions.length - 1
  const starsEarned = answers.filter((answer) => answer.correct).length

  function chooseOption(optionId: string) {
    if (pickedOptionId !== null) return
    const isCorrect = optionId === currentQuestion.correctOptionId

    // Early years children can keep trying until they find the answer.
    if (isEarly && !isCorrect) {
      setWrongOptionIds((previous) => (previous.includes(optionId) ? previous : [...previous, optionId]))
      return
    }

    setAnswers((previous) => [
      ...previous,
      {
        question: currentQuestion,
        chosenOptionId: wrongOptionIds[0] ?? optionId,
        correct: isCorrect && wrongOptionIds.length === 0,
      },
    ])
    setPickedOptionId(optionId)
  }

  function goToNext() {
    stopSpeaking()
    setPickedOptionId(null)
    setWrongOptionIds([])
    setHintOpen(false)

    if (!isLastQuestion) {
      setPosition(position + 1)
    } else if (mode === 'practice') {
      setQuestions((previous) => [...previous, ...(topic.build?.(siteConfig.practiceBatch) ?? [])])
      setPosition(position + 1)
    } else {
      setIsFinished(true)
    }
  }

  const nextLabel =
    mode === 'quiz' && isLastQuestion ? 'See my score' : isEarly ? 'Next' : 'Next question →'
  const missedQuestions = answers.filter((answer) => !answer.correct).map((answer) => answer.question)

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <Link to={topicsPath} onClick={stopSpeaking} className="inline-flex min-h-11 items-center gap-2 text-[17px] font-extrabold text-white no-underline">
            <BackIcon className="size-5" />
            {mode === 'quiz' ? 'Leave quiz' : 'End practice'}
          </Link>
          <span className="font-display text-xl font-semibold text-white">
            {topic.name} · {yearLabel}
          </span>
          {mode === 'quiz' ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[17px] font-extrabold text-white">
              <StarIcon className="size-[22px]" />
              {starsEarned} {starsEarned === 1 ? 'star' : 'stars'}
            </span>
          ) : (
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-[17px] font-extrabold text-white">Practice</span>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[960px] px-6 pb-14 pt-7">
        {isFinished ? (
          <Results
            answers={answers}
            topicsPath={topicsPath}
            onTryNewQuestions={() => onRestart()}
            onRetryMissed={() => onRestart(missedQuestions)}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[17px] font-extrabold">
                {mode === 'quiz' ? `Question ${position + 1} of ${questions.length}` : `Question ${position + 1}`}
              </span>
              {mode === 'quiz' && (
                <div
                  role="progressbar"
                  aria-label="Quiz progress"
                  aria-valuemin={0}
                  aria-valuemax={questions.length}
                  aria-valuenow={position + 1}
                  className="h-3.5 min-w-[220px] flex-1 overflow-hidden rounded-full bg-line"
                >
                  <div
                    className="h-full rounded-full bg-maths"
                    style={{ width: `${((position + 1) / questions.length) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {isEarly ? (
              <EarlyQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                pickedOptionId={pickedOptionId}
                wrongOptionIds={wrongOptionIds}
                onPick={chooseOption}
                nextLabel={nextLabel}
                onNext={goToNext}
              />
            ) : (
              <StandardQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                pickedOptionId={pickedOptionId}
                onPick={chooseOption}
                hintOpen={hintOpen}
                onToggleHint={() => setHintOpen(!hintOpen)}
                nextLabel={nextLabel}
                onNext={goToNext}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface QuizLauncherProps {
  topic: Topic
  mode: Mode
  topicsPath: string
  yearLabel: string
}

/** Holds the current set of questions and starts a fresh session on restart. */
function QuizLauncher({ topic, mode, topicsPath, yearLabel }: QuizLauncherProps) {
  const [session, setSession] = useState(() => ({
    key: 0,
    questions: topic.build?.(topic.questionCount) ?? [],
  }))

  function restart(questions?: Question[]) {
    setSession((previous) => ({
      key: previous.key + 1,
      questions:
        questions && questions.length > 0 ? questions : (topic.build?.(topic.questionCount) ?? []),
    }))
  }

  return (
    <QuizSession
      key={session.key}
      topic={topic}
      mode={mode}
      initialQuestions={session.questions}
      topicsPath={topicsPath}
      yearLabel={yearLabel}
      onRestart={restart}
    />
  )
}

export default function Quiz() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const mode: Mode = searchParams.get('mode') === 'practice' ? 'practice' : 'quiz'
  const yearId = Number(params.year)
  const topic = getTopic(params.subject ?? '', yearId, params.topicId ?? '')
  const yearOption = getYearOption(yearId)
  const topicsPath = `/${params.subject}/${params.year}`

  if (!topic || !topic.build || !yearOption) return <Navigate to={topicsPath} replace />

  return (
    <QuizLauncher
      key={`${topic.id}-${mode}`}
      topic={topic}
      mode={mode}
      topicsPath={topicsPath}
      yearLabel={yearOption.label}
    />
  )
}
