import FeaturedEvents from '../components/landing/FeaturedEvents'
import FinalCta from '../components/landing/FinalCta'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Recommendations from '../components/landing/Recommendations'

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedEvents />
      <Recommendations />
      <FinalCta />
    </>
  )
}
