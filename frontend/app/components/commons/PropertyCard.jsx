'use client'

import React from 'react'
import { propertyCardStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HiArrowsExpand, HiEye, HiHeart, HiLocationMarker, HiOutlineHeart, HiOutlineHome, HiOutlineUserGroup, HiShieldCheck } from 'react-icons/hi'

const PropertyCard = ({
    property,
    renderActions,
    isWishlisted,
    onToggleWishlist
}) => {
    if (!property) return null;

    const { user } = useAuth();
    const router = useRouter();

    // FOR WISHLIST CLICK
    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/login');
            return;
        }
        if (onToggleWishlist) {
            onToggleWishlist(property._id);
        }
    }

    const formattedPrice = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(property.price);

    const statusBadgeClass = s.badgeStatus(property.status);

    // guard against missing/empty image so next/image never gets ""
    const imageSrc = property.images?.[0] && property.images[0].trim() !== ""
        ? property.images[0]
        : "/placeholder-property.jpg";

    return (
        <div className={s.card}>
            <Link href={`/properties/${property._id}`} className={s.link}>
                <div className={s.imageSection}>
                    <Image
                        src={imageSrc}
                        alt={property.title}
                        fill
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

                <div className={s.content}>
                    <div className='flex justify-between items-center'>
                        <span className={s.propertyType}>
                            {property.propertyType}
                        </span>
                        {property.views !== undefined && (
                            <div className={s.views}>
                                <HiEye size={16} />
                                {property.views}
                            </div>
                        )}
                    </div>

                    <h4 className={s.title}>{property.title}</h4>
                    <div className={s.location}>
                        <HiLocationMarker className={s.locationIcon} />
                        <span className='whitespace-nowrap overflow-hidden text-ellipsis'>
                            {property.area}, {property.city}
                        </span>
                    </div>

                    <div className={s.specsGrid}>
                        {property.propertyType?.toLowerCase() === "commercial" ? (
                            <>
                                <div className={s.specItem}>
                                    <div className={s.specIcon}>
                                        <HiOutlineHome size={20} />
                                    </div>
                                    <div className={s.specValue}>{property.status}</div>
                                    <div className={s.specLabel}>Type</div>
                                </div>
                                <div className={`${s.specItem} ${s.specDivider}`}>
                                    <div className={s.specIcon}>
                                        <HiArrowsExpand size={20} />
                                    </div>
                                    <div className={s.specValue}>{property.areaSize}</div>
                                    <div className={s.specLabel}>Sq Ft</div>
                                </div>
                                <div className={s.specItem}>
                                    <div className={s.specIcon}>
                                        <HiShieldCheck size={20} />
                                    </div>
                                    <div className={s.specValue}>OK</div>
                                    <div className={s.specLabel}>Legal</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={s.specItem}>
                                    <div className={s.specIcon}>
                                        <HiOutlineHome size={20} />
                                    </div>
                                    <div className={s.specValue}>{property.bhk}</div>
                                    <div className={s.specLabel}>Beds</div>
                                </div>
                                <div className={`${s.specItem} ${s.specDivider}`}>
                                    <div className={s.specIcon}>
                                        <HiOutlineUserGroup size={20} />
                                    </div>
                                    <div className={s.specValue}>
                                        {property.bathrooms ||
                                            Math.max(1, parseInt(property.bhk) - 1 || 0)}
                                    </div>
                                    <div className={s.specLabel}>Baths</div>
                                </div>
                                <div className={s.specItem}>
                                    <div className={s.specIcon}>
                                        <HiArrowsExpand size={20} />
                                    </div>
                                    <div className={s.specValue}>{property.areaSize}</div>
                                    <div className={s.specLabel}>Sq Ft</div>
                                </div>
                            </>
                        )}
                    </div>

                    {!renderActions && (
                        <div className={s.viewDetailsButton}>
                            <button className={s.viewDetailsBtn}>
                                View Details
                            </button>
                        </div>
                    )}
                </div>
            </Link>

            {renderActions && (
                <div
                    className={s.actionsContainer}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {renderActions(property)}
                </div>
            )}
        </div>
    )
}

export default PropertyCard