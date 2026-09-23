'use client'

import React, { useState } from 'react'
import { landingPageStyles as s } from '@/assets/dummyStyles.js'
import PropertyCard from '@/app/components/commons/PropertyCard.jsx';
import { useRouter } from 'next/navigation.js';

const FeaturedCollection = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    return (
        <div className={s.featuredSection}>
            <div className={s.container}>
                <div className={s.featuredHeader}>
                    <span className={s.featuredBadge}>Handpicked For You</span>
                    <h2 className={s.featureTitle}>Featured Collections</h2>
                    <p className={s.featuredSubtitle}>
                        Discover high-value properties curated by our experts for their exceptional design,
                        location, and investment potential.
                    </p>
                </div>

                {loading ? (
                    <div className={s.loadingContainer}>
                        <div className={s.loader}></div>
                    </div>
                ) : error ? (
                    <div className={s.errorContainer}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className={s.propertiesGrid}>
                        {properties
                            .filter((p) => p)
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 6)
                            .map((property) => (
                                <PropertyCard
                                    key={property._id}
                                    property={property}
                                    isWishlisted={wishlistedIds.includes(String(property._id))}
                                    onToggleWishlist={handleToggleWishlist}
                                />
                            ))}                           
                    </div>
                )}

                <div className={s.discoverButtonContainer}>
                    <button className={s.discoverButton} onClick={()=> router.push('/properties')}>
                        Discover More Properties
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FeaturedCollection
