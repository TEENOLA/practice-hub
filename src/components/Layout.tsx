import { Link, Outlet } from 'react-router-dom'
import { siteConfig } from '../config'
import { BookIcon } from './icons'

export function SiteHeader() {
  return (
    <header className="bg-ink">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-white no-underline">
          <span className="grid size-11 place-items-center rounded-xl bg-star text-ink">
            <BookIcon className="size-[26px]" />
          </span>
          <span className="font-display text-[22px] font-semibold">{siteConfig.schoolName} Practice Hub</span>
        </Link>
        <a
          href={siteConfig.schoolSiteUrl}
          className="py-2.5 text-base font-bold text-[#c9d8ea] no-underline hover:text-white"
        >
          Back to the school website
        </a>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-[#c9d8ea]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-3 px-6 py-6 text-[15px]">
        <span>{siteConfig.schoolName} Practice Hub · British and Nigerian primary curriculum</span>
        <span>Your answers are not saved or shared.</span>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
