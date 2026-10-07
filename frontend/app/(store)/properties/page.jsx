"use client";

import Navbar from "@/app/components/commons/Navbar.jsx";
import PropertyCard from "@/app/components/commons/PropertyCard.jsx";
import { propertiesStyles as s } from "@/assets/dummyStyles.js";
import API_URL from "@/config.js";
import { useAuth } from "@/context/AuthContext.jsx";
import axios from "axios";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";
import {
    Suspense,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    HiAdjustments,
    HiFilter,
    HiSearch,
    HiViewGrid,
    HiViewList,
    HiX,
} from "react-icons/hi";

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
    const [showMobileFilters, setShowMobileFilters] =
        useState(false);

    /*
     * Nigerian Naira price range
     *
     * Minimum: ₦1 Million
     * Maximum: ₦1 Billion
     */
    const MIN_PRICE = 1000000;
    const MAX_PRICE = 1000000000;

    const [filters, setFilters] = useState({
        city: "",
        propertyType: [],
        bhk: "",
        maxPrice: MAX_PRICE,
        amenities: [],
        furnishing: [],
        sort: "latest",
    });

    const propertyType = [
        {
            label: "Flat/Apartment",
            value: "flat",
        },
        {
            label: "Independent House/Villa",
            value: "villa",
        },
        {
            label: "Penthouse",
            value: "penthouse",
        },
        {
            label: "Commercial",
            value: "commercial",
        },
    ];

    const bhkOptions = ["1", "2", "3", "4", "5+"];

    const furnishingOptions = [
        {
            label: "Furnished",
            value: "furnished",
        },
        {
            label: "Semi-Furnished",
            value: "semi-furnished",
        },
        {
            label: "Unfurnished",
            value: "unfurnished",
        },
    ];

    const fetchTimer = useRef(null);

    /*
     * Format prices using Nigerian Naira
     */
    const formatPrice = (value) => {
        if (!value || value <= 0) {
            return "₦0";
        }

        if (value >= 1000000000) {
            return `₦${(value / 1000000000).toFixed(1)}B`;
        }

        if (value >= 1000000) {
            return `₦${(value / 1000000).toFixed(0)}M`;
        }

        if (value >= 1000) {
            return `₦${(value / 1000).toFixed(0)}K`;
        }

        return `₦${value.toLocaleString("en-NG")}`;
    };

    /*
     * Fetch filters from URL
     */
    useEffect(() => {
        const city = searchParams.get("city") || "";
        const type = searchParams.get("type") || "";
        const bhk = searchParams.get("bhk") || "";

        const initialFilters = {
            city,
            propertyType: type ? [type] : [],
            bhk,
            maxPrice: MAX_PRICE,
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

    /*
     * Cleanup debounce timer
     */
    useEffect(() => {
        return () => {
            if (fetchTimer.current) {
                clearTimeout(fetchTimer.current);
            }
        };
    }, []);

    /*
     * Fetch properties
     */
    const fetchProperties = async (currentFilters) => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (currentFilters.city) {
                params.append(
                    "city",
                    currentFilters.city
                );
            }

            if (
                currentFilters.propertyType &&
                currentFilters.propertyType.length > 0
            ) {
                params.append(
                    "propertyType",
                    currentFilters.propertyType.join(",")
                );
            }

            if (currentFilters.bhk) {
                params.append(
                    "bhk",
                    currentFilters.bhk
                );
            }

            if (
                currentFilters.maxPrice !== undefined &&
                currentFilters.maxPrice !== null
            ) {
                params.append(
                    "maxPrice",
                    currentFilters.maxPrice
                );
            }

            if (
                currentFilters.amenities &&
                currentFilters.amenities.length > 0
            ) {
                params.append(
                    "amenities",
                    currentFilters.amenities.join(",")
                );
            }

            if (
                currentFilters.furnishing &&
                currentFilters.furnishing.length > 0
            ) {
                params.append(
                    "furnishing",
                    currentFilters.furnishing.join(",")
                );
            }

            if (currentFilters.sort) {
                params.append(
                    "sort",
                    currentFilters.sort
                );
            }

            const res = await axios.get(
                `${API_URL}/api/properties?${params.toString()}`
            );

            setProperties(
                Array.isArray(res.data.properties)
                    ? res.data.properties
                    : []
            );

            setError(null);
        } catch (err) {
            console.error(
                "Failed to fetch properties:",
                err
            );

            setError(
                "Failed to load properties. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Fetch wishlist
     */
    const fetchWishlist = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const list = Array.isArray(res.data)
                ? res.data
                : res.data.wishlist || [];

            setWishlistedIds(
                list
                    .filter((item) => item.property)
                    .map((item) =>
                        String(item.property._id)
                    )
            );
        } catch (error) {
            console.error(
                "Failed to fetch wishlist:",
                error
            );
        }
    };

    /*
     * Toggle wishlist
     */
    const handleToggleWishlist = async (propertyId) => {
        const id = String(propertyId);

        try {
            const isWishlisted =
                wishlistedIds.includes(id);

            if (isWishlisted) {
                await axios.delete(
                    `${API_URL}/api/wishlist/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setWishlistedIds((prev) =>
                    prev.filter(
                        (wid) => wid !== id
                    )
                );
            } else {
                await axios.post(
                    `${API_URL}/api/wishlist/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setWishlistedIds((prev) => [
                    ...prev,
                    id,
                ]);
            }
        } catch (err) {
            console.error(
                "Failed to toggle wishlist:",
                err
            );
        }
    };

    /*
     * Debounce API requests
     */
    const debouncedFetch = (updatedFilters) => {
        if (fetchTimer.current) {
            clearTimeout(fetchTimer.current);
        }

        fetchTimer.current = setTimeout(() => {
            fetchProperties(updatedFilters);
        }, 500);
    };

    /*
     * Checkbox filters
     */
    const handleCheckboxChange = (
        category,
        value
    ) => {
        const current = [
            ...(filters[category] || []),
        ];

        const index = current.indexOf(value);

        if (index === -1) {
            current.push(value);
        } else {
            current.splice(index, 1);
        }

        const updatedFilters = {
            ...filters,
            [category]: current,
        };

        setFilters(updatedFilters);

        fetchProperties(updatedFilters);
    };

    /*
     * Price slider
     */
    const handlePriceChange = (e) => {
        const value = parseInt(
            e.target.value,
            10
        );

        const updatedFilters = {
            ...filters,
            maxPrice: value,
        };

        setFilters(updatedFilters);

        debouncedFetch(updatedFilters);
    };

    /*
     * BHK filter
     */
    const handleBhkSelect = (value) => {
        const updatedFilters = {
            ...filters,
            bhk:
                filters.bhk === value
                    ? ""
                    : value,
        };

        setFilters(updatedFilters);

        fetchProperties(updatedFilters);
    };

    /*
     * Sort
     */
    const handleSortChange = (e) => {
        const newSort = e.target.value;

        const updatedFilters = {
            ...filters,
            sort: newSort,
        };

        setFilters(updatedFilters);

        fetchProperties(updatedFilters);
    };

    /*
     * Apply filters
     */
    const applyFilters = () => {
        if (fetchTimer.current) {
            clearTimeout(fetchTimer.current);
        }

        fetchProperties(filters);
    };

    /*
     * Reset filters
     */
    const resetFilters = () => {
        if (fetchTimer.current) {
            clearTimeout(fetchTimer.current);
        }

        const reset = {
            city: "",
            propertyType: [],
            bhk: "",
            maxPrice: MAX_PRICE,
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
                {/* Mobile filter button */}
                <div
                    className={
                        s.mobileFilterButtonWrapper
                    }
                >
                    <button
                        onClick={() =>
                            setShowMobileFilters(
                                true
                            )
                        }
                        className={
                            s.mobileFilterButton
                        }
                    >
                        <HiFilter />
                        Show Filters & Search
                    </button>
                </div>

                <div className={s.layout}>
                    {/* SIDEBAR */}
                    <aside
                        className={`${s.sidebar} ${showMobileFilters
                            ? s.sidebarVisible
                            : s.sidebarHidden
                            }`}
                    >
                        {/* Sidebar header */}
                        <div
                            className={
                                s.sidebarHeader
                            }
                        >
                            <div
                                className={
                                    s.sidebarTitleWrapper
                                }
                            >
                                <HiFilter
                                    className={
                                        s.sidebarTitleIcon
                                    }
                                />

                                <h2
                                    className={
                                        s.sidebarTitle
                                    }
                                >
                                    Filters
                                </h2>
                            </div>

                            <div
                                className={
                                    s.sidebarHeaderActions
                                }
                            >
                                <button
                                    className={
                                        s.resetButton
                                    }
                                    onClick={
                                        resetFilters
                                    }
                                >
                                    Reset
                                </button>

                                <button
                                    className={
                                        s.closeMobileFilters
                                    }
                                    onClick={() =>
                                        setShowMobileFilters(
                                            false
                                        )
                                    }
                                >
                                    <HiX />
                                </button>
                            </div>
                        </div>

                        <div
                            className={
                                s.filtersScrollArea
                            }
                        >
                            {/* LOCATION */}
                            <div
                                className={
                                    s.filterSection
                                }
                            >
                                <label
                                    className={
                                        s.filterLabel
                                    }
                                >
                                    Location
                                </label>

                                <div
                                    className={
                                        s.searchInputWrapper
                                    }
                                >
                                    <HiSearch
                                        className={
                                            s.searchIcon
                                        }
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search by city"
                                        value={
                                            filters.city
                                        }
                                        onChange={(e) => {
                                            const updatedFilters =
                                            {
                                                ...filters,
                                                city: e
                                                    .target
                                                    .value,
                                            };

                                            setFilters(
                                                updatedFilters
                                            );

                                            debouncedFetch(
                                                updatedFilters
                                            );
                                        }}
                                        className={
                                            s.searchInput
                                        }
                                    />
                                </div>
                            </div>

                            {/* PRICE RANGE */}
                            <div
                                className={
                                    s.filterSection
                                }
                            >
                                <div
                                    className={
                                        s.priceHeader
                                    }
                                >
                                    <label
                                        className={
                                            s.filterLabel
                                        }
                                    >
                                        Price Range
                                    </label>

                                    <span
                                        className={
                                            s.priceValue
                                        }
                                    >
                                        {formatPrice(
                                            filters.maxPrice
                                        )}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={MIN_PRICE}
                                    max={MAX_PRICE}
                                    step={5000000}
                                    value={
                                        filters.maxPrice
                                    }
                                    onChange={
                                        handlePriceChange
                                    }
                                    className={
                                        s.priceSlider
                                    }
                                />

                                <div
                                    className={
                                        s.priceLabels
                                    }
                                >
                                    <span>
                                        ₦1M
                                    </span>

                                    <span>
                                        ₦1B
                                    </span>
                                </div>
                            </div>

                            {/* PROPERTY TYPE */}
                            <div
                                className={
                                    s.filterSection
                                }
                            >
                                <label
                                    className={
                                        s.filterLabel
                                    }
                                >
                                    Property Type
                                </label>

                                <div
                                    className={
                                        s.checkboxGroup
                                    }
                                >
                                    {propertyType.map(
                                        (type) => (
                                            <label
                                                key={
                                                    type.value
                                                }
                                                className={
                                                    s.checkboxLabel
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={filters.propertyType.includes(
                                                        type.value
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            "propertyType",
                                                            type.value
                                                        )
                                                    }
                                                    className={
                                                        s.checkbox
                                                    }
                                                />

                                                {
                                                    type.label
                                                }
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* BHK */}
                            <div
                                className={
                                    s.filterSection
                                }
                            >
                                <label
                                    className={
                                        s.filterLabel
                                    }
                                >
                                    BHK (Bedrooms)
                                </label>

                                <div
                                    className={
                                        s.bhkGroup
                                    }
                                >
                                    {bhkOptions.map(
                                        (option) => (
                                            <button
                                                key={
                                                    option
                                                }
                                                onClick={() =>
                                                    handleBhkSelect(
                                                        option
                                                    )
                                                }
                                                className={`${s.bhkButton} ${filters.bhk ===
                                                    option
                                                    ? s.bhkButtonActive
                                                    : s.bhkButtonInactive
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* FURNISHING */}
                            <div
                                className={
                                    s.filterSection
                                }
                            >
                                <label
                                    className={
                                        s.filterLabel
                                    }
                                >
                                    Furnishing
                                </label>

                                <div
                                    className={
                                        s.checkboxGroup
                                    }
                                >
                                    {furnishingOptions.map(
                                        (option) => (
                                            <label
                                                key={
                                                    option.value
                                                }
                                                className={
                                                    s.checkboxLabel
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        filters.furnishing?.includes(
                                                            option.value
                                                        )
                                                    }
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            "furnishing",
                                                            option.value
                                                        )
                                                    }
                                                    className={
                                                        s.checkbox
                                                    }
                                                />

                                                {
                                                    option.label
                                                }
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main
                        className={
                            s.mainContent
                        }
                    >
                        {/* Header */}
                        <div
                            className={
                                s.contentHeader
                            }
                        >
                            <div>
                                <span
                                    className={
                                        s.resultCount
                                    }
                                >
                                    Showing{" "}
                                    <strong
                                        className={
                                            s.resultCountStrong
                                        }
                                    >
                                        {loading
                                            ? "..."
                                            : properties.length}
                                    </strong>{" "}
                                    Properties
                                </span>
                            </div>

                            <div
                                className={
                                    s.headerControls
                                }
                            >
                                {/* View mode */}
                                <div
                                    className={
                                        s.viewModeToggle
                                    }
                                >
                                    <button
                                        onClick={() =>
                                            setViewMode(
                                                "grid"
                                            )
                                        }
                                        className={`${s.viewModeButton} ${viewMode ===
                                            "grid"
                                            ? s.viewModeActive
                                            : s.viewModeInactive
                                            }`}
                                    >
                                        <HiViewGrid
                                            size={20}
                                        />
                                    </button>

                                    <button
                                        onClick={() =>
                                            setViewMode(
                                                "list"
                                            )
                                        }
                                        className={`${s.viewModeButton} ${viewMode ===
                                            "list"
                                            ? s.viewModeActive
                                            : s.viewModeInactive
                                            }`}
                                    >
                                        <HiViewList
                                            size={20}
                                        />
                                    </button>
                                </div>

                                {/* Sort */}
                                <div
                                    className={
                                        s.sortControl
                                    }
                                >
                                    <span
                                        className={
                                            s.sortLabel
                                        }
                                    >
                                        Sort:
                                    </span>

                                    <select
                                        value={
                                            filters.sort
                                        }
                                        onChange={
                                            handleSortChange
                                        }
                                        className={
                                            s.sortSelect
                                        }
                                    >
                                        <option value="latest">
                                            Latest
                                        </option>

                                        <option value="priceLow">
                                            Price: Low to
                                            High
                                        </option>

                                        <option value="priceHigh">
                                            Price: High to
                                            Low
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* PROPERTY CONTENT */}
                        {loading ? (
                            <div
                                className={
                                    s.skeletonGrid
                                }
                            >
                                {[
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                ].map((i) => (
                                    <div
                                        className={
                                            s.skeletonCard
                                        }
                                        key={i}
                                    />
                                ))}
                            </div>
                        ) : error ? (
                            <div
                                className={
                                    s.errorContainer
                                }
                            >
                                <HiX
                                    size={48}
                                    className={
                                        s.errorIcon
                                    }
                                />

                                <h3
                                    className={
                                        s.errorTitle
                                    }
                                >
                                    {error}
                                </h3>

                                <button
                                    className={
                                        s.errorButton
                                    }
                                    onClick={
                                        applyFilters
                                    }
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : properties.length ===
                            0 ? (
                            <div
                                className={
                                    s.emptyContainer
                                }
                            >
                                <div
                                    className={
                                        s.emptyIconWrapper
                                    }
                                >
                                    <HiAdjustments
                                        size={32}
                                        className={
                                            s.emptyIcon
                                        }
                                    />
                                </div>

                                <h2
                                    className={
                                        s.emptyTitle
                                    }
                                >
                                    No properties found
                                </h2>

                                <p
                                    className={
                                        s.emptyText
                                    }
                                >
                                    Broaden your search
                                    criteria
                                </p>

                                <button
                                    className={
                                        s.emptyButton
                                    }
                                    onClick={
                                        resetFilters
                                    }
                                >
                                    Clear All
                                </button>
                            </div>
                        ) : (
                            <div
                                className={`${s.propertyList} ${viewMode ===
                                    "grid"
                                    ? s.propertyListGrid
                                    : s.propertyListList
                                    }`}
                            >
                                {properties
                                    .filter(
                                        (property) =>
                                            property
                                    )
                                    .map(
                                        (property) => (
                                            <PropertyCard
                                                key={
                                                    property._id
                                                }
                                                property={
                                                    property
                                                }
                                                isWishlisted={wishlistedIds.includes(
                                                    String(
                                                        property._id
                                                    )
                                                )}
                                                onToggleWishlist={
                                                    handleToggleWishlist
                                                }
                                            />
                                        )
                                    )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile overlay */}
            {showMobileFilters && (
                <div
                    onClick={() =>
                        setShowMobileFilters(
                            false
                        )
                    }
                    className={
                        s.mobileOverlay
                    }
                />
            )}
        </div>
    );
};

export default function PropertiesPageWrapper() {
    return (
        <Suspense
            fallback={
                <div>Loading...</div>
            }
        >
            <PropertiesPage />
        </Suspense>
    );
}