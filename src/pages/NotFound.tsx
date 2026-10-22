import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[720px] px-6 py-20 text-center">
      <h1 className="font-display text-4xl font-semibold">We cannot find that page</h1>
      <p className="mt-3 text-lg text-soft">Let us take you back to the start.</p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-14 items-center rounded-2xl bg-ink px-7 text-lg font-extrabold text-white no-underline"
      >
        Go to the home page
      </Link>
    </section>
  )
}
