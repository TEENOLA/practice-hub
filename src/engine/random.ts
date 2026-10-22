export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function shuffle<Item>(items: readonly Item[]): Item[] {
  const copy = [...items]
  for (let position = copy.length - 1; position > 0; position--) {
    const swapWith = randomInt(0, position)
    ;[copy[position], copy[swapWith]] = [copy[swapWith], copy[position]]
  }
  return copy
}

export function pickOne<Item>(items: readonly Item[]): Item {
  return items[randomInt(0, items.length - 1)]
}

/** 1234567 -> "1,234,567" */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-GB')
}

export function makeQuestionId(topicId: string): string {
  return `${topicId}-${Math.random().toString(36).slice(2, 9)}`
}
