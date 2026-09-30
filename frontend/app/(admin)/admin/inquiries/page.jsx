'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'
import { adminInquiriesStyles as s } from '@/assets/dummyStyles.js'
import axios from 'axios'
import API_URL from '@/config.js'
import { HiOutlineAnnotation, HiOutlineCalendar, HiOutlineHome, HiOutlineMail, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi'

const page = () => {
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}/api/admin/inquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.data.success) {
          setInquiries(res.data.inquiries);
        }

      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false);
      }
    }

    fetchInquiries();
  }, [token]);

  if (loading) {
    return (
      <div className={s.loaderFullPage}>
        <div className={s.loader} />
      </div>
    )
  }

  if (error) {
    return (
      <div className='error-container p-8 text-center text-[#dc2626]'>
        <h3>Error loading inquiries</h3>
        <p>{error}</p>
        <button className='btn' onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <div className={s.headerContainer}>
        <h1 className={s.headerTitle}>Platform Inquiries</h1>
        <p className={s.headerSubtitle}>
          Review communication between buyers and sellers
        </p>
      </div>

      <div className={s.listContainer}>
        {inquiries.map((inq) => (
          <div key={inq._id} className={s.inquiryCard}>
            <div className={s.cardTopSection}>
              <div className={s.propertyInfoWrapper}>
                <div className={s.propertyIconWrapper}>
                  <HiOutlineHome size={24} />
                </div>
                
                <div className={s.propertyTextWrapper}>
                  <div className={s.propertyTitle}>
                    {inq.property?.title || "Unknown Property"}
                  </div>

                  <div className={s.propertyId}>
                    Property ID: {inq.property?._id}
                  </div>
                </div>
              </div>

              <div className={s.dateWrapper}>
                <HiOutlineCalendar className={s.dateIcon} /> {" "}
                {new Date(inq.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className={s.detailsGrid}>
              <div className={s.detailCard}>
                <div className={s.detailLabel}>Buyer Details</div>
                <div className={s.detailName}>{inq.buyer?.name}</div>
                <div className={s.detailEmail}>{inq.buyer?.email}</div>
              </div>

              <div className={s.detailCard}>
                <div className={s.detailLabel}>Seller Details</div>
                <div className={s.detailName}>{inq.seller?.name}</div>
                <div className={s.detailEmail}>{inq.seller?.email}</div>
              </div>
            </div>

            <div className={s.messageContainer}>
              <div className={s.messageHeader}>
                <HiOutlineAnnotation /> MESSAGE
              </div>
              <p className={s.messageText}>"{inq.message}"</p>
            </div>
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className={s.emptyState}>
            <div className={s.emptyIconWrapper}>
                <HiOutlineAnnotation size={48} className='mx-auto' /> 
            </div>
            <h2>No inquiries found</h2>
            <p className={s.emptyText}>
              There are no inquiries recorded on the platform yet.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default page;