'use client'

import React, { useEffect, useState } from 'react'
import { adminPropertiesStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import PropertyCard from '@/app/components/commons/PropertyCard.jsx'
import axios from 'axios'
import API_URL from '@/config.js'
import Link from 'next/link'
import { HiOutlineExternalLink, HiOutlineTrash } from 'react-icons/hi'

const page = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}/api/admin/properties`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const props = Array.isArray(res.data)
          ? res.data
          : res.data.properties || []
        setProperties(props)

      } catch (err) {
        console.error("Failed to load properties:", err);
        setError(err.response?.data?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties()
  }, [token])

  const handleDelete = async (id) => {
    if (!window.confirm(
      "Are you sure you want to delete the property? This action cannot be undone"
    )) return;

    try {
      await axios.delete(`${API_URL}/api/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties((prev) => prev.filter((p) => p._id !== id))

    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className={s.loaderFullPage}>
        <div className={s.loader} />
      </div>
    )
  }

  return (
    <>
      <div className={s.headerContainer}>
        <h1 className={s.pageTitle}>Property Moderation</h1>
        <p className={s.pageSubtitle}>
          Review and manage all property listings across the platform.
        </p>
      </div>

      {error && (
        <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>
      )}

      <div className={s.headerContainer}>
        {" "}
        {properties.length === 0 ? (
          <div className={s.emptyStateCard}>
            No properties found.
          </div>
        ) : (
          <div className={s.propertiesGrid}>
            {properties.map((p) => (
              <PropertyCard
                key={p._id}
                property={p}
                renderActions={() => (
                  <div className={s.actionWrapper}>
                    <div className={s.sellerInfo}>
                      <div className={s.sellerName}>
                        Seller: {p.seller?.name || "Unknown"}
                      </div>
                      <div className={s.sellerEmail}>{p.seller?.email}</div>
                    </div>

                    <div className={s.buttonGroup}>
                      <Link href={`/properties/${p._id}`} className={s.viewLink}>
                        <HiOutlineExternalLink size={16} />
                      </Link>

                      <button className={s.deleteButton} onClick={() => handleDelete(p._id)}>
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                )}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default page