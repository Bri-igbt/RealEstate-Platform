'use client'

import React, { useEffect, useState } from 'react'
import { wishlistStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import Navbar from '@/app/components/commons/Navbar.jsx'
import axios from 'axios'
import API_URL from '@/config.js'
import { HiHeart, HiTrash } from 'react-icons/hi'
import Link from 'next/link'
import PropertyCard from '@/app/components/commons/PropertyCard.jsx'

const page = () => {
    const { token } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const items = Array.isArray(res.data) ? res.data : res.data.wishlist || [];
            setWishlistItems(items);

        } catch (error) {
            setError("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;
        fetchWishlist();
    }, [token]);

    const removeFromWishlist = async (propertyId) => {
        if (!propertyId) {
            alert("Invalid Property ID");
            return;
        }

        try {
            await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setWishlistItems((prev) =>
                prev.filter(
                    (item) => item.property && item.property._id !== propertyId,
                ),
            )
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to remove from wishlist.";
            alert(errorMsg);
        }
    };

    if (loading)
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        )

    return (
        <div className={s.pageContainer}>
            <Navbar />
            <main className={s.mainContainer}>
                <div className={s.headingWrapper}>
                    <h1 className={s.heading}>Your Wishlist</h1>
                    <p className={s.subheading}>
                        Properties you're saved for later.
                    </p>
                </div>

                {error && (
                    <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>
                )}

                {wishlistItems.filter((item) => item.property).length === 0 ? (
                    <div className={s.emptyCard}>
                        <div className={s.emptyIconWrapper}>
                            <HiHeart size={40} />
                        </div>

                        <div>
                            <h2 className={s.emptyTitle}>Your wishlist is empty</h2>
                            <p className={s.emptyText}>
                                Start exploring properties and save your favorites!
                            </p>

                            <Link href='/properties' className={s.browseButton}>
                                Browse Properties
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className={s.gridContainer}>
                        {wishlistItems
                            .filter((item) => item.property)
                            .map((item) => (
                                <PropertyCard
                                    key={item._id}
                                    property={item.property}
                                    renderActions={() => (
                                        <button
                                            className={s.removeButton}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeFromWishlist(item.property._id)
                                            }}
                                        >
                                            <HiTrash size={18} />
                                            Remove From Wishlist
                                        </button>
                                    )}
                                />
                            ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default page