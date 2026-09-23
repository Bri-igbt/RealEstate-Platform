'use client'

import React, { useEffect, useState } from 'react'
import { landingPageStyles as s } from '@/assets/dummyStyles.js' 
import {  HiHome, HiLocationMarker, HiSearch, HiShieldCheck,} from 'react-icons/hi'
import { useAuth } from '@/context/AuthContext.jsx'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import API_URL from '@/config.js'
import Image from 'next/image.js'
import banner from '@/assets/bannerimage.jpg'


const Hero = () => {
    const {user, token} = useAuth();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [properties, setProperties] = useState([]);
    const [propertyType, setPropertyType] = useState("Select Type");
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [propertyCounts, setPropertyCounts] = useState({
        flat: 0,
        villa: 0,
        penthouse: 0,
        commercial: 0,
    });

    useEffect(() => {
        fetchProperties();
        fetchCounts();
        if (user) {
            fetchWishlist();
        }
    },[user]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}`}
            });
            setWishlistedIds(
                res.data
                    .filter((item) => item.property)
                    .map((item) => String(item.property._id)),
            )
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        }
    };

    // TO REMOVE A WISHLIST
    const handleToggleWishlist = async (propertyId) => {
        try {
            const isWishlisted = wishlistedIds.includes(propertyId);
            if(isWishlisted) {
                await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlistedIds((prev)=> prev.filter((id) => id !== propertyId))
            } else {
                await axios.post(`${API_URL}/api/wishlist${propertyId}`,{}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setWishlistedIds((prev) => [...prev, propertyId])
            }

        } catch (error) {
            console.error("Failed to toggle wishlist", error);
        }
    }

    // TO FETCH COUNTS
    const fetchCounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/property/counts`);
            if(res.data.success) {
                setPropertyCounts(res.data.counts)
            }
        } catch (err) {
            console.error("Failed to fetch property counts:", err)
        }
    }

    // TO FETCH PROPERTIES
    const fetchProperties = async (search = "") => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/property?city=${search}`);
            setProperties(res.data.properties || res.data || []);
            setError(null);

        } catch (error) {
            setError("Failed to load properties. Please try again")
        } finally {
            setLoading(false)
        }
    }

    // TO HANDLESEARCH
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if(searchTerm) params.append("city", searchTerm);
        if(propertyType !== "Select Type") params.append("type", propertyType);
        router.push(`/properties?${params.toString()}`);
    }

    


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

                    <form onSubmit={handleSearch} className={s.searchForm}>
                        <div className={s.searchField}>
                            <div className={s.textPrimary}>
                                <HiLocationMarker size={26} />
                            </div>
                            <div className={s.flexCol}>
                                <label className={s.labelSmall}>Location</label>
                                <input
                                    type="text"
                                    placeholder='Where are you looking'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={s.inputTransparent}
                                />
                            </div>
                        </div>

                        <div className={s.searchDivider}></div>
                        <div className={s.searchField}>
                            <div className={s.textPrimary}>
                                <HiHome size={26} />
                            </div>
                            <div className={s.flexCol}>
                                <label className={s.labelSmall}>Property Type</label>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className={`${s.inputTransparent} cursor-pointer`}
                                >
                                    <option value="Select Type">Select Type</option>
                                    <option value="flat">Flat/Apartment</option>
                                    <option value="villa">Villa/House</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>
                        </div>

                        <button type='submit' className={s.searchButton}>
                            <HiSearch size={22} />
                            Search
                        </button>
                    </form>

                    {/* STATS */}
                    <div className={s.statsContainer}>
                        <div className={s.statItemFlex}>
                            <h3 className={s.statNumber}>12k+</h3>
                            <p className={s.statLabel}>Ready Properties</p>
                        </div>
                        <div className={s.statItemBorder}>
                            <h3 className={s.statNumber}>500+</h3>
                            <p className={s.statLabel}>Agent Network</p>
                        </div>
                        <div className={s.statItemBorder}>
                            <h3 className={s.statNumber}>4.9/5</h3>
                            <p className={s.statLabel}>User Rating</p>
                        </div>
                    </div>
                </div>

                {/* HERO IMAGE */}
                <div className={s.heroImageContainer}>
                    <div className={s.imageWrapper}>
                        <Image
                            src={banner}
                            alt='banner'
                            className={s.heroImage}
                        />

                        <div className={s.verifiedBadge}>
                            <div className={s.badgeIconWrapper}>
                                <HiShieldCheck size={24} className='text-primary' />
                            </div>
                            <div>
                                <h4 className={s.badgeTitle}>Verified Listing</h4>
                                <p className={s.badgeText}>
                                    Inspected by our team
                                </p>
                            </div>

                            <span className={s.preApproved}>Pre-Approved</span>
                        </div>
                    </div>
                </div>
            </section>
    )
}

export default Hero
