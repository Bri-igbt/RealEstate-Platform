'use client'
import { landingPageStyles as s } from '@/assets/dummyStyles.js' 
import Navbar from '@/app/components/commons/Navbar.jsx'
import Hero from '@/app/components/Home/Hero.jsx'



const page = () => {
  return (
    <div className={s.bgMain}>
      <Navbar />
      <Hero />
    </div>
  )
}

export default page
