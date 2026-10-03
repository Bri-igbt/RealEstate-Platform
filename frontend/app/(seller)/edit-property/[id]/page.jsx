'use client'

import React, { useEffect, useState } from 'react'
import { editPropertyStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import API_URL from '@/config.js'

const page = () => {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        city: "",
        area: "",
        pincode: "",
        propertyType: "flat",
        bhk: "",
        bathrooms: "",
        areaSize: "",
        furnishing: "unfurnished",
        status: "sale",
        amenities: [],
        securityDeposit: "",
        maintenance: "",
    });

    const commonAmenities = [
        "Parking",
        "Pool",
        "Gym",
        "Security",
        "Wifi",
        "Power Backup",
        "Club House",
        "Garden",
    ];

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/properties/${id}`);
                const p = res.data.property;
                setFormData({
                    title: p.title || "",
                    description: p.description || "",
                    price: p.price || "",
                    city: p.city || "",
                    area: p.area || "",
                    pincode: p.pincode || "",
                    propertyType: p.propertyType || "flat",
                    bhk: p.bhk || "",
                    bathrooms: p.bathrooms || "",
                    areaSize: p.areaSize || "",
                    furnishing: p.furnishing || "unfurnished",
                    status: p.status || "sale",
                    amenities: p.amenities || [],
                    securityDeposit: p.securityDeposit || "",
                    maintenance: p.maintenance || "",
                });
                setExistingImages(p.images || []);
                setLoading(false);
            } catch (error) {
                setError("Failed to load property");
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAmentityChange = (amenity) => {
        setFormData((prev) => {
            const current = prev.amenities || [];
            if(current.includes(amenity)) {
                return {...prev, amenities: current.filter((e) => e !== amenity)}
            } else {
                return { ...prev, amenities: [...current, amenity]}
            }
        })
    };

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        if(existingImages.length + newImages.length + files.length > 10 ) {
            setError("Total images cannot exceed 10.");
            return;
        }
        setNewImages((prev) => [...prev, ...files]);
        const previews = files.map((file) => URL.createObjectURL(file));
        setNewImagePreviews((prev) => [...prev, ...previews])
    }

    const removeExistingImage = (url) => {
        setExistingImages(existingImages.filter((img) => img !== url));
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const data = new formData();
        Object.keys(formData).forEach((key) => {
            if(key === "amenities") {
                data.append("amenities", JSON.stringify(formData[key]));
            } else if (key === "securityDeposit" || key === "maintenence") {
                data.append(key, formData[key] || 0);
            } else {
                data.append(key, formData[key]);
            }
        });

        data.append("existingImages", JSON.stringify(existingImages));
        newImages.forEach((img) => data.append("images", img));

        try {
            await axios.put(`${API_URL}/api/properties/${id}`, data, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            });
            router.push("/dashboard");

        } catch (error) {
            setError(error.response?.data?.message || "Failed to update property");
            setSubmitting(false);
        }
    };

    if(loading) {
        return (
            <div className='loader-full-page'>
                <div className='loader'></div>
            </div>
        )
    }

    return (
        <div className={s.pageContainer}>
            <div className={s.innerContainer}>
                <div className={s.headerWrapper}>
                    <h1 className={s.pageTitle}>Edit Property</h1>
                    <p className={s.pageSubtitle}>
                        Update your property details and manage your images.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={s.formContainer}>
                    {error && (
                        <div
                            style={{
                                padding: "1rem",
                                background: "#fee2e2",
                                color: "#dc2626",
                                borderRadius: "0.75rem",
                                marginBottom: "2rem",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div className={s.section}>
                        <div className={s.sectionHeader}>
                            <div className={s.sectionIndicator} />
                            <h3>Content & Description</h3>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default page