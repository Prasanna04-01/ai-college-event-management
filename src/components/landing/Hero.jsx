import Badge from '../ui/Badge'
import Button from '../ui/Button'
import HeroVisual from './HeroVisual'

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <Badge className="uppercase tracking-[0.14em]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            AI-POWERED COLLEGE EVENT MANAGEMENT
          </Badge>
          <h1 className="mt-6 max-w-xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
            Discover events.
            <span className="relative mt-1 block text-brand-600">
              Build experiences.
              <span className="absolute bottom-1 left-0 h-[7px] w-[min(100%,240px)] rounded-full bg-brand-100" />
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-[16px] leading-7 text-muted">
            Find campus events that fit your interests, register in a few clicks,
            attend with your friends, and get AI recommendations tailored to your
            department, clubs, and past activity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/events" size="lg">
              Explore Events
            </Button>
            <Button to="/register" size="lg" variant="secondary">
              Get Started
            </Button>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  )
}
