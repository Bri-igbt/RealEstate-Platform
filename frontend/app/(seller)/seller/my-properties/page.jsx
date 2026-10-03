'use client'

import React, { useEffect, useState } from 'react'
import { myPropertiesStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import Link from 'next/link'
import axios from 'axios'
import API_URL from '@/config.js'
import { HiOutlineCheckCircle, HiOutlineLibrary, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi'
import PropertyCard from '@/app/components/commons/PropertyCard.jsx'

const page = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchMyProperties = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API_URL}/api/properties/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const props = Array.isArray(res.data)
                ? res.data
                : res.data.properties || [];
            setProperties(props);

        } catch (error) {
            setError("Failed to load your properties");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;
        fetchMyProperties()
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?"))
            return;

        try {
            await axios.delete(`${API_URL}/api/properties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties((prev) => prev.filter((p) => p._id !== id))
        } catch (error) {
            alert("Failed to delete a property");
        }
    }

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(
                `${API_URL}/api/properties/${id}/status`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }
            );
            setProperties((prev) =>
                prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
            );
        } catch (error) {
            alert("Failed to update a property");
        }
    }

    if (loading) {
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        )
    }

    return (
        <div className={s.fadeIn}>
            <div className={s.header}>
                <div>
                    <h1 className={s.heading}>My Listings</h1>
                    <p className={s.subheading}>
                        Manage your listed properties and their status.
                    </p>
                </div>

                <Link href='/add-property' className={s.addButton}>
                    Add New Listing
                </Link>
            </div>

            {error && (
                <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>
            )}

            <div className={s.content}>
                {!Array.isArray(properties) || properties.length === 0 ? (
                    <div className={s.emptyCard}>
                        <div className={s.emptyIconWrapper}>
                            <HiOutlineLibrary size={40} color='#94a3b8' />
                        </div>
                        <h2 className={s.emptyTitle}>No Properties Found.</h2>
                        <p className={s.emptyText}>
                            Start your journey by adding your first property
                        </p>
                        <Link href='/add-property' className={s.emptyButton}>
                            Add Your First Listing
                        </Link>
                    </div>
                ) : (
                    <div className={s.grid}>
                        {properties.map((p) => (
                            <PropertyCard
                                key={p._id}
                                property={p}
                                renderActions={() => (
                                    <div className={s.actionContainer}>
                                        <div className={s.selectWrapper}>
                                            <select
                                                value={p.status === "sale" ? "available" : p.status}
                                                onClick={(e) => e.stopPropagation()}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    updateStatus(p._id, val === "available" ? "sale" : val);
                                                }}
                                                className={`${s.select} ${p.status === "sold"
                                                    ? s.selectSold
                                                    : s.selectAvailable
                                                    }`}
                                            >
                                                <option value="available">Available</option>
                                                <option value="sold">Sold</option>
                                            </select>

                                            <div className={s.selectIcon}>
                                                <HiOutlineCheckCircle size={14} />
                                            </div>
                                        </div>

                                        <Link
                                            href={`/edit-property/${p._id}`}
                                            className={s.editButton}
                                        >
                                            <HiOutlinePencilAlt />
                                            Edit
                                        </Link>

                                        <button
                                            className={s.deleteButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(p._id);
                                            }}
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default page