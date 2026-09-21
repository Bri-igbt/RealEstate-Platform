'use client'

import { landingPageStyles as s } from '@/assets/dummyStyles.js'
import { HiCurrencyDollar, HiLightningBolt, HiShieldCheck, HiVideoCamera } from "react-icons/hi";

const Features = () => {

    const features = [
            {
                title: "Verified Trust",
                desc: "Every listing is strictly audited for ownership, condition, and legality.",
                icon: <HiShieldCheck size={24} />,
            },
            {
                title: "Smart Search",
                desc: "Our AI-driven algorithms help you find the best matches based on preferences.",
                icon: <HiLightningBolt size={24} />,
            },
            {
                title: "Best Value",
                desc: "Direct-from-owner listings and zero-commission options to ensure competitive prices.",
                icon: <HiCurrencyDollar size={24} />,
            },
            {
                title: "Virtual Tours",
                desc: "High-definition 3D tours allow you to experience the property from home.",
                icon: <HiVideoCamera size={24} />,
            },
        ];

    return (
        <div className={s.featuredSection}>
            <div className={s.featuresContainer}>
                <div className={s.featuresList}>
                    {features.map((f, idx)=> (
                        <div key={idx} className={s.featureCard} style={{ animationDelay: `${idx * 0.1}s`}}>
                            <div className={s.featureIconWrapper}>{f.icon}</div>
                            <h3 className={s.featureTitle}>{f.title}</h3>
                            <p className={s.featureDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className={s.featuresContent}>
                    <h2 className={s.featuresHeading}>
                        Why RealEstate <br />
                        is the <span className={s.textPrimary}>Preferred Choice.</span>
                    </h2>
                    <p className={s.featuresSubtext}>
                        We've reinvented the property search experience from the ground
                        up. By focusing on transparency, technological precision, and
                        user-centric design, we help you find not just a house, but a
                        home.
                    </p>

                    <ul className={s.featuresListItems}>
                        {[
                            "Direct connection with certified agents",
                            "Real-time market valuation data",
                            "Secure document management system",
                            "24/7 Premium customer support",
                        ].map((item, idx) => (
                            <li className={s.listItem} key={idx}>
                                <HiLightningBolt className='text-primary' /> {item}
                            </li>
                        ))}
                    </ul>
                    <a href='#process' className={s.learnMoreLink}>
                        Learn more about our process &rarr;
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Features
