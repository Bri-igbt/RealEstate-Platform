'use client'

import React, { useEffect, useState } from 'react'
import { landingPageStyles as s } from '@/assets/dummyStyles.js'
import PropertyCard from '@/app/components/commons/PropertyCard.jsx';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext.jsx';
import API_URL from '@/config.js';
import axios from 'axios';

const FeaturedCollection = () => {
    const router = useRouter();
    const { user, token } = useAuth();
    const [properties, setProperties] = useState([]);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProperties();
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/properties?sort=latest`);
            setProperties(res.data.properties);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch featured properties:", err);
            setError("Failed to load properties.");
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const list = Array.isArray(res.data) ? res.data : res.data.wishlist || [];
            setWishlistedIds(
                list.filter((item) => item.property).map((item) => String(item.property._id)),
            );
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    };

    const handleToggleWishlist = async (propertyId) => {
        const id = String(propertyId);
        try {
            const isWishlisted = wishlistedIds.includes(id);
            if (isWishlisted) {
                await axios.delete(`${API_URL}/api/wishlist/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWishlistedIds((prev) => prev.filter((wid) => wid !== id));
            } else {
                await axios.post(
                    `${API_URL}/api/wishlist/${id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                setWishlistedIds((prev) => [...prev, id]);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

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
                    <button className={s.discoverButton} onClick={() => router.push('/properties')}>
                        Discover More Properties
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FeaturedCollection