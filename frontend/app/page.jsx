'use client'
import { landingPageStyles as s } from '@/assets/dummyStyles.js' 
import Navbar from '@/app/components/commons/Navbar.jsx'
import Hero from '@/app/components/Home/Hero.jsx'
import Category from '@/app/components/Home/Category.jsx'
import Features from '@/app/components/Home/Features.jsx'
import HowItWorks from '@/app/components/Home/HowItWorks.jsx'
import FeaturedCollection from '@/app/components/Home/FeaturedCollection.jsx'
import Footer from '@/app/components/commons/Footer.jsx'



const page = () => {
  return (
    <div className={s.bgMain}>
      <Navbar />
      <Hero />
      <Category />
      <Features />
      <HowItWorks />
      <FeaturedCollection />
      <Footer />
    </div>
  )
}

export default page
