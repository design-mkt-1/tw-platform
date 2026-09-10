import { Icon } from '@/components/primitives/Icon'
import { LOGO } from '@/lib/assets'

/**
 * Holding page. The casino home is assembled in the next pass; this exists so the deployed
 * link stops showing the previous project's build while that work lands.
 *
 * It is built from the real tokens on purpose — #E8F1FC header, #F7FAFF page, the measured
 * logo — so that if it renders wrong here, it renders wrong everywhere, and we find out now
 * rather than after twenty components are written on top of it.
 */
export default function Home() {
  return (
    <>
      <header className="flex h-[60px] items-center bg-header px-gutter">
        <Icon src={LOGO} alt="Top-Win" width={111} height={20} priority />
      </header>

      <main className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center gap-3 bg-page px-gutter text-center">
        <h1 className="font-roboto text-section-title text-title">Демоверсія у розробці</h1>
        <p className="max-w-[280px] text-sm text-body-muted">
          Мобільна демонстрація платформи Top-Win. Сторінки казино та спорту з’являться тут
          найближчим часом.
        </p>
      </main>
    </>
  )
}
