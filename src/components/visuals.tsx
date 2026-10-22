import type { QuestionVisual } from '../engine/types'

type ObjectsVisual = Extract<QuestionVisual, { kind: 'objects' }>
type BusStopVisual = Extract<QuestionVisual, { kind: 'bus-stop' }>

function Mango() {
  return (
    <svg width="78" height="78" viewBox="0 0 76 76" aria-hidden="true">
      <ellipse cx="38" cy="44" rx="23" ry="27" fill="#f28c28" stroke="#a8560b" strokeWidth="3" transform="rotate(-18 38 44)" />
      <path d="M40 17c6-9 17-9 21-4-4 6-12 8-21 4z" fill="#2e8b4e" stroke="#1a5e32" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function Star() {
  return (
    <svg width="78" height="78" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.2 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="#f5b301" stroke="#a87800" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function Ball() {
  return (
    <svg width="78" height="78" viewBox="0 0 76 76" aria-hidden="true">
      <circle cx="38" cy="38" r="28" fill="#2457d6" stroke="#14388f" strokeWidth="3" />
      <path d="M14 30c14 6 34 6 48 0M14 46c14-6 34-6 48 0" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

const OBJECT_PICTURES = { mango: Mango, star: Star, ball: Ball }
const OBJECT_PLURALS = { mango: 'mangoes', star: 'stars', ball: 'balls' }

export function ObjectsPicture({ visual }: { visual: ObjectsVisual }) {
  const Picture = OBJECT_PICTURES[visual.item]
  return (
    <div
      role="img"
      aria-label={`${visual.count} ${OBJECT_PLURALS[visual.item]}`}
      className="flex min-h-[232px] flex-wrap content-center justify-center gap-x-2.5 gap-y-1.5 rounded-3xl border-[3px] border-line bg-white px-3 py-5"
    >
      {Array.from({ length: visual.count }, (_, position) => (
        <Picture key={position} />
      ))}
    </div>
  )
}

export function BusStopPicture({ visual }: { visual: BusStopVisual }) {
  return (
    <div
      role="img"
      aria-label={`${visual.dividend} divided by ${visual.divisor}, written in the bus stop layout`}
      className="inline-flex items-start rounded-2xl bg-paper px-5 py-3.5 font-display text-5xl font-semibold leading-tight"
    >
      <span className="pr-3 pt-2.5">{visual.divisor}</span>
      <span className="rounded-tl-2xl border-l-[5px] border-t-[5px] border-ink pl-4 pr-1.5 pt-1.5 tracking-[0.22em]">
        {visual.dividend}
      </span>
    </div>
  )
}
