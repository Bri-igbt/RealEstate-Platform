'use client'

import Navbar from "@/app/components/commons/Navbar.jsx"
import { propertiesStyles as s } from "@/assets/dummyStyles.js"
import API_URL from "@/config.js"
import { useAuth } from "@/context/AuthContext.jsx"
import axios from "axios"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { HiFilter } from "react-icons/hi"

const PropertiesPage = () => {
    const router = useRouter();
    const { user, token } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [properties, setProperties] = useState([]);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filters, setFilters] = useState({
        city: "",
        propertyType: [],
        bhk: "",
        maxPrice: 100000000,
        amenities: [],
        furnishing: [],
        sort: "latest",
    });

    const propertyType = [
        { label: "Flat/Apartment", value: "flat" },
        { label: "Independent House/Villa", value: "villa" },
        { label: "Penthouse", value: "penthouse" },
        { label: "Commercial", value: "commercial" },
    ];
    const bhkOptions = ["1", "2", "3", "4", "5+"];
    const furnishingOptions = [
        { label: "Furnished", value: "furnished" },
        { label: "Semi-Furnished", value: "semi-furnished" },
        { label: "Unfurnished", value: "unfurnished" },
    ];

    useEffect(() => {
        const city = searchParams.get("city") || "";
        const type = searchParams.get("type") || "";
        const bhk = searchParams.get("bhk") || "";

        const initialFilters = {
            city,
            propertyType: type ? [type] : [],
            bhk,
            maxPrice: 100000000,
            amenities: [],
            furnishing: [],
            sort: "latest",
        };

        setFilters(initialFilters);
        fetchProperties(initialFilters);
        if (user) {
            fetchWishlist();
        }
    }, [searchParams, user]);

    const fetchProperties = async (currentFilters) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (currentFilters.city) params.append("city", currentFilters.city);
            if (currentFilters.propertyType.length > 0)
                params.append("propertyType", currentFilters.propertyType.join(","));
            if (currentFilters.bhk) params.append("bhk", currentFilters.bhk);
            if (currentFilters.maxPrice)
                params.append("maxPrice", currentFilters.maxPrice);
            if (currentFilters.furnishing && currentFilters.furnishing.length > 0)
                params.append("furnishing", currentFilters.furnishing.join(","));
            if (currentFilters.sort) params.append("sort", currentFilters.sort);

            const res = await axios.get(
                `${API_URL}/api/property?${params.toString()}`,
            );
            setProperties(res.data.properties);
            setError(null);
        } catch (err) {
            setError("Failed to load properties. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWishlistedIds(
                res.data
                    .filter((item) => item.property)
                    .map((item) => String(item.property._id)),
            );
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        }
    };

    const fetchTimer = useRef(null);

    const handleToggleWishlist = async (propertyId) => {
        try {
            const isWishlisted = wishlistedIds.includes(propertyId);
            if(isWishlisted){
                await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}`},
                });
                setWishlistedIds((prev) => prev.filter((id) => id !== propertyId ));
            } else {
                await axios.post(
                    `${API_URL}/api/wishlist/${propertyId}`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setWishlistedIds((prev)=> [...prev, propertyId]);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    }

    const debouncedFetch = (updatedFilters) => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchTimer.current = setTimeout(() => {
            fetchProperties(updatedFilters);
        }, 500);
    };

    const handleCheckboxChange = (category, value) => {
        const current = [...(filters[category] || [])];
        const index = current.indexOf(value);
        if (index === -1) {
            current.push(value);
        } else {
            current.splice(index, 1);
        }
        const updatedFilters = { ...filters, [category]: current };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        const updatedFilters = { ...filters, maxPrice: value };
        setFilters(updatedFilters);
        debouncedFetch(updatedFilters);
    };

    const handleBhkSelect = (value) => {
        const updatedFilters = {
            ...filters,
            bhk: filters.bhk === value ? "" : value,
        };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        const updatedFilters = { ...filters, sort: newSort };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const applyFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchProperties(filters);
    };

    const resetFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        const reset = {
            city: "",
            propertyType: [],
            bhk: "",
            maxPrice: 100000000,
            amenities: [],
            furnishing: [],
            sort: "latest",
        };
        setFilters(reset);
        router.push("/properties");
        fetchProperties(reset);
    };

    return (
        <div className={s.pageContainer}>
            <Navbar />

            <div className={s.container}>
                <div className={s.mobileFilterButtonWrapper}>
                    <button onClick={() => setShowMobileFilters(true)} className={s.mobileFilterButton}>
                        <HiFilter /> Show Filters & Search
                    </button>
                </div>

                <div className={s.layout}>
                    <aside className={`${s.sidebar} ${showMobileFilters ? s.sidebarVisible : s.sidebarHidden}`}>
                        <div className={s.sidebarHeader}>
                            <div className={s.sidebarTitleWrapper}>
                                <HiFilter className={s.sidebarTitleIcon} />
                                <h2 className={s.sidebarTitle}>Filters</h2>
                            </div>

                            <div className={s.sidebarHeaderActions}>
                                <button className={s.resetButton} onClick={resetFilters}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default function PropertiesPageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PropertiesPage />
        </Suspense>
    );
}