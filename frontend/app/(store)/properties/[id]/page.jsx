'use client'

import Navbar from "@/app/components/commons/Navbar.jsx"
import PropertyCard from "@/app/components/commons/PropertyCard.jsx";
import { propertyDetailsStyles as s } from "@/assets/dummyStyles.js"
import API_URL from "@/config.js";
import { useAuth } from "@/context/AuthContext.jsx";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiBadgeCheck, HiCalendar, HiChatAlt, HiChevronLeft, HiChevronRight, HiCollection, HiHeart, HiLocationMarker, HiOutlineChevronRight, HiOutlineHeart, HiOutlineHome, HiOutlineUserGroup, HiOutlineViewGrid, HiX } from "react-icons/hi";

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [inquiry, setInquiry] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [inquiryStatus, setInquiryStatus] = useState({
        loading: false,
        success: false,
        error: null,
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/properties/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setProperty(res.data.property);
                setSimilarProperties(res.data.similarProperties || []);

                if (user && user.role === "buyer") {
                    const wishRes = await axios.get(`${API_URL}/api/wishlist`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const wishlist = Array.isArray(wishRes.data)
                        ? wishRes.data
                        : wishRes.data.wishlist || [];
                    const found = wishlist.some((item) => item.property?._id === id);
                    setIsInWishlist(found);
                }
                setError(null);
            } catch (err) {
                setError("Failed to load property details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user, token]);

    // TO TOGGLE WISHLIST 
    const handleWishlistToggle = async () => {
        if (!user) return router.push("/login");
        try {
            if (isInWishlist) {
                await axios.delete(`${API_URL}/api/wishlist/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsInWishlist(false);
            } else {
                await axios.post(`${API_URL}/api/wishlist/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsInWishlist(true);
            }
        } catch (err) {
            alert("Failed to update wishlist");
        }
    };

    // TO HANDLE INQUIRY SUBMIT
    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!user) return router.push('/login');
        if (user.role !== "buyer") return alert("Only buyers can send inquiries");
        setInquiryStatus({ ...inquiryStatus, loading: true });
        try {
            await axios.post(`${API_URL}/api/inquiry`, {
                propertyId: id,
                message: inquiry.message
            }, { headers: { Authorization: `Bearer ${token}` } });
            setInquiryStatus({ loading: false, success: true, error: null });
            setInquiry({ ...inquiry, message: "" });

        } catch (error) {
            setInquiryStatus({
                loading: false,
                success: false,
                error: "Failed to send inquiry"
            });
        }
    };

    // TO START A CHAT
    const handleChatStart = async () => {
        if (!user) return router.push("/login");
        if (user.role !== "buyer") {
            return alert("Only buyers can chat with sellers");
        }

        try {
            const res = await axios.post(`${API_URL}/api/chat/start`, {
                propertyId: id,
                sellerId: property.seller._id
            },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });

            const chat = res.data;
            await axios.post(
                `${API_URL}/api/chat/send`, {
                chatId: chat._id,
                text: `(Context: Interested in property "${property.title}")`,
                image: property.images?.[0],
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }
            );
            router.push(`/chat-messages?chatId=${chat._id}`);

        } catch (err) {
            console.error("Error starting chat:", err);
            alert("Failed to start chat.");
        }
    };

    if (loading) {
        return (
            <div className="loader-full-page">
                <div className="loader"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="container" style={{ padding: "4rem", textAlign: "center" }}>
                {error || "Property not found"}
            </div>
        );
    }

    // guard against missing images so gallery/lightbox never crash
    const images = property.images && property.images.length > 0
        ? property.images
        : ["/placeholder-property.jpg"];

    const formattedPrice = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(property.price);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = () =>
        setLightboxIndex((prev) => (prev + 1) % images.length);
    const prevImage = () =>
        setLightboxIndex(
            (prev) => (prev - 1 + images.length) % images.length,
        );

    return (
        <div className={s.pageContainer}>
            <Navbar />

            <main className={s.mainContainer}>
                <nav className={s.breadcrumbs}>
                    <Link href='/' className={s.breadcrumbLink}>
                        Home
                    </Link>
                    <HiOutlineChevronRight />
                    <span className={s.breadcrumbCurrent}>{property.title}</span>
                </nav>

                <div className={s.galleryContainer}>
                    <div
                        className={s.galleryGrid}
                        style={{
                            gridTemplateColumns:
                                images.length > 1 ? "repeat(4, 1fr)" : "1fr",
                            gridTemplateRows:
                                images.length > 1 ? "repeat(2, 180px)" : "400px",
                        }}
                    >
                        <div
                            className={s.galleryMainItem(images.length > 1)}
                            onClick={() => openLightbox(0)}
                        >
                            <Image
                                src={images[0]}
                                alt="Property image"
                                fill
                                className={s.galleryImage}
                            />
                        </div>

                        {images.slice(1, 5).map((img, idx) => (
                            <div
                                key={idx}
                                className={s.gallerySideItem}
                                onClick={() => openLightbox(idx + 1)}
                            >
                                <Image
                                    src={img}
                                    alt="image"
                                    fill
                                    className={s.galleryImage}
                                />
                                {idx === 3 && images.length > 5 && (
                                    <div className={s.galleryMoreOverlay}>
                                        +{images.length - 5}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={s.mobileSliderContainer}>
                        <div className={s.mobileSliderTrack}>
                            {images.map((img, idx) => (
                                <div className={s.mobileSlide} key={idx} onClick={() => openLightbox(idx)}>
                                    <Image
                                        src={img}
                                        alt="image"
                                        fill
                                        className={s.mobileSlideImage}
                                    />
                                    <div className={s.mobileSlideCounter}>
                                        {idx + 1} / {images.length}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* LIGHTBOX MODAL */}
                {lightboxIndex !== null && (
                    <div className={s.lightboxOverlay} onClick={closeLightbox}>
                        <button onClick={closeLightbox} className={s.lightboxCloseBtn}>
                            <HiX size={24} className={s.lightboxCloseIcon} />
                        </button>

                        <div className={s.lightboxContent} onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={images[lightboxIndex]}
                                alt="images"
                                fill
                                className={s.lightboxImage}
                            />

                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className={s.lightboxPrevBtn}>
                                        <HiChevronLeft size={30} />
                                    </button>
                                    <button onClick={nextImage} className={s.lightboxPrevBtn}>
                                        <HiChevronRight size={30} />
                                    </button>
                                </>
                            )}

                            <div className={s.lightboxCounter}>
                                {lightboxIndex + 1} / {images.length}
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN CONTENT */}
                <div className={s.detailsLayout}>
                    <div className={s.infoColumn}>
                        <div className={s.infoHeader}>
                            <div className={s.titleWrapper}>
                                <div className={s.badgeWrapper}>
                                    <span className={s.premiumBadge}>Premium Listing</span>
                                </div>
                                <h1 className={s.propertyTitle}>{property.title}</h1>
                                <p className={s.propertyLocation}>
                                    <HiLocationMarker className={s.locationIcon} />
                                    <span className={s.locationText}>
                                        {property.area}, {property.city}, Nigeria
                                    </span>
                                </p>
                            </div>

                            <div className={s.actionButtons}>
                                {(!user || user.role === "buyer") && (
                                    <button
                                        onClick={handleWishlistToggle}
                                        className={s.wishlistButton(isInWishlist)}
                                    >
                                        {isInWishlist ? (
                                            <HiHeart size={26} fill="#ef4444" />
                                        ) : (
                                            <HiOutlineHeart size={26} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* QUICK STATS */}
                        <div className={s.statsGrid}>
                            {[
                                {
                                    label: "Bedrooms",
                                    value: property.bhk || 0,
                                    icon: HiOutlineHome,
                                },
                                {
                                    label: "Bathrooms",
                                    value:
                                        property.bathrooms ||
                                        Math.max(1, (parseInt(property.bhk) || 1) - 1),
                                    icon: HiOutlineUserGroup,
                                },
                                {
                                    label: "Furnishing",
                                    value: property.furnishing || "N/A",
                                    icon: HiCollection,
                                },
                                {
                                    label: "Living Area",
                                    value: `${property.areaSize} sqft`,
                                    icon: HiOutlineViewGrid,
                                },
                                {
                                    label: "Type",
                                    value: property.propertyType,
                                    icon: HiCalendar,
                                },
                            ].map((stat, i) => (
                                <div key={i} className={s.statCard}>
                                    {stat.icon && <stat.icon size={18} className={s.statIcon} />}
                                    <div className={s.statValue}>{stat.value}</div>
                                    <div className={s.statLabel}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className={s.descriptionSection}>
                            <h3 className={s.sectionTitle}>Description</h3>
                            <p className={s.descriptionText}>
                                {property.description || "No description available for this property"}
                            </p>
                        </div>

                        <div className={s.amenitiesSection}>
                            <h3 className={s.sectionTitle}>Amenities</h3>
                            <div className={s.amenitiesGrid}>
                                {(property.amenities?.length
                                    ? property.amenities
                                    : ["Parking", "Security", "Water Supply", "Power Backup"]
                                ).map((amn, i) => (
                                    <div className={s.amenityItem} key={i}>
                                        <HiBadgeCheck size={18} className={s.amenityIcon} />
                                        <span className={s.amenityText}>{amn}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={s.sidebarColumn}>
                        <div className={s.priceCard} style={{
                            background: "var(--primary)"
                        }}
                        >
                            <div className={s.priceCardLabel}>
                                {property.status?.toLowerCase() === "rent"
                                    ? "Rental Details"
                                    : "Listing Price"
                                }
                            </div>

                            <div className={s.priceCardValue}>
                                {property.status?.toLowerCase() === "rent"
                                    ? `₦${Number(property.price).toLocaleString("en-NG")}`
                                    : formattedPrice}
                                {property.status?.toLowerCase() === "rent" && (
                                    <span className={s.priceCardPeriod}> /month</span>
                                )}
                            </div>

                            {property.status?.toLowerCase() === "rent" && (
                                <div className={s.rentDetails}>
                                    <div className={s.rentDetailRow}>
                                        <span className={s.rentDetailLabel}>Security Deposit</span>
                                        <span className={s.rentDetailValue}>
                                            ₦
                                            {Number(property.securityDeposit || 0).toLocaleString("en-NG")}
                                        </span>
                                    </div>

                                    <div className={s.rentDetailRow}>
                                        <span className={s.rentDetailLabel}>Maintenance</span>
                                        <span className={s.rentDetailValue}>
                                            ₦
                                            {Number(property.maintenance || 0).toLocaleString("en-NG")}/mo
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className={s.priceCardAvailability}>
                                Available for{" "}
                                {property.status?.toLowerCase() === "rent" ? "Rent" : "Sale"}
                            </div>
                        </div>

                        {/* SELLER CARD */}
                        <div className={s.sellerCard}>
                            <div className={s.sellerInfo}>
                                <div className={s.sellerAvatar}>
                                    <img
                                        src={
                                            property.seller?.profilePic ||
                                            `https://ui-avatars.com/api/?name=${property.seller?.name || "Seller"}&background=0d6e59&color=fff`
                                        }
                                        alt="Agent"
                                        className={s.sellerAvatarImage}
                                    />
                                </div>
                                <div className={s.sellerDetails}>
                                    <div className={s.sellerNameLink}>
                                        <h4 className={s.sellerName}>
                                            {property.seller?.name || "Seller"}
                                        </h4>
                                    </div>
                                    <div className={s.sellerVerifiedBadge}>
                                        <HiBadgeCheck className={s.verifiedIcon} /> Verified Seller
                                    </div>
                                </div>
                            </div>

                            <div className={s.chatButtonWrapper}>
                                <button className={s.chatButton} onClick={handleChatStart}>
                                    <HiChatAlt /> Chat
                                </button>
                            </div>

                            {/* Inquiry Form */}
                            <h4 className={s.inquiryFormTitle}>Inquire</h4>
                            <form onSubmit={handleInquirySubmit}>
                                {user?.role === "buyer" ? (
                                    <>
                                        <textarea
                                            placeholder="Your Message..."
                                            value={inquiry.message}
                                            onChange={(e) =>
                                                setInquiry({ ...inquiry, message: e.target.value })
                                            }
                                            className={s.inquiryTextarea}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className={s.inquirySubmitButton}
                                            disabled={inquiryStatus.loading}
                                        >
                                            {inquiryStatus.loading ? "Sending..." : "Send Inquiry"}
                                        </button>
                                        {inquiryStatus.success && (
                                            <p className={s.inquirySuccessMessage}>Inquiry sent!</p>
                                        )}
                                    </>
                                ) : (
                                    <div className={s.inquiryDisabledMessage}>
                                        <p className={s.inquiryDisabledText}>
                                            {user
                                                ? "Only buyers can send inquiries."
                                                : "Please login as a buyer to send inquiries."}
                                        </p>
                                        {!user && (
                                            <Link href="/login" className={s.inquiryLoginButton}>
                                                Login
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                <div className={s.additionalDetails}>
                    <h3 className={s.detailsTitle}>Property Details</h3>
                    <div className={s.detailsGrid}>
                        {[
                            {
                                label: "Property ID",
                                value: property._id.slice(-8).toUpperCase(),
                            },
                            {
                                label: "Added On",
                                value: new Date(property.createdAt).toLocaleDateString(),
                            },
                            { label: "Property Type", value: property.propertyType },
                            { label: "Status", value: `For ${property.status}` },
                        ].map((detail, i) => (
                            <div className={s.detailRow} key={i}>
                                <span className={s.detailValue}>{detail.label}</span>
                                <span className={s.detailValue}>{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <section className={s.similarSection}>
                    <div className={s.similarHeader}>
                        <div>
                            <h2 className={s.similarTitle}>Similar Properties</h2>
                            <p className={s.similarSubtitle}>
                                Listing you might like in {property.city}
                            </p>
                        </div>

                        <Link href='/properties' className={s.similarAllLink}>
                            All Listings
                            <HiChevronRight />
                        </Link>
                    </div>

                    <div className={s.similarGrid}>
                        {similarProperties.length > 0 ? (
                            similarProperties.slice(0,3).map((p) => <PropertyCard key={p._id} property={p} />)
                        ) : (
                            <div className={s.similarEmptyState}>
                                No similar properties found in this location
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PropertyDetailsPage;