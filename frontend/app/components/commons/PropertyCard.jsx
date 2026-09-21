'use client'

import React from 'react'
import { propertyCardStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useRouter } from 'next/navigation.js'
import Link from 'next/link.js'
import Image from 'next/image.js'
import { HiHeart, HiOutlineHeart, HiShieldCheck } from 'react-icons/hi'

const PropertyCard = ({ 
    property,
    renderActions,
    isWishlisted,
    onToggleWishlist
}) => {
    if(!property) return null;

    const {user} = useAuth();
    const router = useRouter();

    // FOR WISHLIST CLICK
    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(!user){
            router.push('/login');
            return;
        }
        if(onToggleWishlist){
            onToggleWishlist(property._id);
        }
    }

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "NGR",
        maximumFractionDigits: 0,
    }).format(property.price);

    const statusBadgeClass = s.badgeStatus(property.status);

    return (
        <div className={s.card}>
            <Link href={`/property/${property._id}`} className={s.link}>
                <div className={s.imageSection}>
                    <Image 
                        src={property.Image[0]}
                        alt={property.title}
                        className={s.image}
                    />

                    <div className={s.topBadges}>
                        <div className={s.badgesLeft}>
                            {renderActions ? (
                                <span className={statusBadgeClass}>
                                    {property.status === "sale" ? "available" : property.status}
                                </span>
                            ) : (
                                    <span className={s.badgeNew}>New</span>
                            )}

                            <span className={s.badgeVerified}>
                                <HiShieldCheck size={14} /> Verified
                            </span>
                        </div>

                        {(!user || user.role === "buyer") && (
                            <button className={s.wishlistButton(isWishlisted)} onClick={handleWishlistClick}>
                                {isWishlisted ? (
                                    <HiHeart size={20} />
                                ) : (
                                    <HiOutlineHeart size={20} />
                                )}
                            </button>
                        )}
                    </div>

                    <div className={s.priceOverlay}>
                        <h3 className={s.price}>{formattedPrice}</h3>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default PropertyCard
