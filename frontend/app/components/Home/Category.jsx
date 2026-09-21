'use client'

import { landingPageStyles as s } from '@/assets/dummyStyles.js'
import { useRouter } from 'next/navigation.js'
import { useState } from 'react';
import { HiHome, HiOfficeBuilding } from "react-icons/hi";

const Category = () => {
    const router = useRouter();
        const [propertyCounts, setPropertyCounts] = useState({
            flat: 0,
            villa: 0,
            penthouse: 0,
            commercial: 0,
        });

    const categories = [
        {
            name: "Modern Flats",
            count: propertyCounts.flat || 0,
            icon: <HiOfficeBuilding size={32} />,
            type: "flat",
        },
        {
            name: "Luxury Villas",
            count: propertyCounts.villa || 0,
            icon: <HiHome size={32} />,
            type: "villa",
        },
        {
            name: "Penthouse",
            count: propertyCounts.penthouse || 0,
            icon: <HiOfficeBuilding size={32} />,
            type: "penthouse",
        },
        {
            name: "Commercial",
            count: propertyCounts.commercial || 0,
            icon: <HiOfficeBuilding size={32} />,
            type: "commercial",
        },
    ];
    
    return (
        <section className={s.categorySection}>
            <div className={s.container}>
                <div className={s.categoryHeader}>
                    <div className={s.categoryHeaderText}>
                        <h2 className={s.categoryTitle}>Browse by Category</h2>
                        <p className={s.categoryDesc}>
                            Explore curated collections of properties tailored to your specfic 
                            lifestyle and needs.
                        </p>
                    </div>
                </div>

                <div className={s.categoryGrid}>
                    {categories.map((cat, idx)=> (
                        <div 
                            key={idx}
                            className={s.categoryCard}
                            onClick={(()=> router.push(`/properties?type=${cat.type}`))}
                        >
                            <div className={s.categoryIconWrapper}>{cat.icon}</div>
                            <h3 className={s.categoryName}>{cat.name}</h3>
                            <p className={s.categoryCount}>
                                {cat.count.toLocaleString()} Properties
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Category
