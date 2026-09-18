import React from 'react'
import { landingPageStyles as s } from '@/assets/dummyStyles.js' 

const Hero = () => {
    return (
        <section className={s.heroSection}>
            <div className={s.heroContent}>
                <span className={s.badge}>
                    Trusted by 20,000+ homeowners
                </span>

                <h1 className={s.heroTitle}>
                    Find Your 
                    <span className={s.textGradient}>{" "}Perfect{" "}</span>
                    Next Chapter.
                </h1>
                <p className={s.heroSubtitle}>
                    Experience the most advanced real estate  serarch platform. Discover verified 
                    listings, connect with top agents, and find a place you will love.
                </p>

                
            </div>
        </section>
    )
}

export default Hero
