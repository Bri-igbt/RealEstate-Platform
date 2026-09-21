import React from 'react'
import { landingPageStyles as s } from '@/assets/dummyStyles.js'
import { HiLightningBolt, HiShieldCheck, HiVideoCamera } from 'react-icons/hi'

const HowItWorks = () => {
    return (
        <div id='process' className={s.processSection}>
            <div className={s.container}>
                <div className={s.processHeader}>
                    <span className={s.processBadge}>
                        How It Works
                    </span>
                    <h2 className={s.processTitle}>
                        Our Seamless {" "}
                        <span className={s.textGradient}>Process</span>
                    </h2>
                    <p className={s.processSubtitle}>
                        We've simplified the journey of finding your dream home into three clear,
                        stress-free steps.
                    </p>
                </div>

                <div className={s.processGrid}>
                    {[
                    {
                        step: "01",
                        title: "Smart Search",
                        desc: "Leverage our AI-driven Smart Search algorithms to find the best property matches tailored to your specific preferences.",
                        icon: <HiLightningBolt size={32} />,
                    },
                    {
                        step: "02",
                        title: "Virtual Tours",
                        desc: "Experience your future home from anywhere with our high-definition 3D virtual tours and immersive walkthroughs.",
                        icon: <HiVideoCamera size={32} />,
                    },
                    {
                        step: "03",
                        title: "Verified Trust",
                        desc: "Every listing is strictly audited for ownership and condition, ensuring your peace of mind and a secure transaction.",
                        icon: <HiShieldCheck size={32} />,
                    },
                    ].map((p, idx) => (
                        <div className={s.processCard} key={idx}>
                            <div className={s.stepNumber}>{p.step}</div>
                            <div className={s.processIconWrapper}>{p.icon}</div>
                            <h3 className={s.processCardTitle}>{p.title}</h3>
                            <h3 className={s.processCardDesc}>{p.desc}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HowItWorks
