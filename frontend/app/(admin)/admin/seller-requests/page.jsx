'use client'

import React, { useEffect, useState } from 'react'
import { sellerRequestsStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import axios from 'axios'
import API_URL from '@/config.js'
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'

const page = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}/api/admin/pending-sellers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setRequests(res.data.pendingSellers)
        }
      } catch (err) {
        console.error("Failed to load seller requests:", err);
        setError(err.response?.data?.message || "Failed to load seller requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/admin/approve-seller/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setRequests((prev) => prev.filter((req) => req._id !== id));
        alert("Seller Approved Successfully!")
      }

    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve seller")
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
    <div className={s.container}>
      <div className={s.headerContainer}>
        <h1 className={s.pageTitle}>Seller Verification</h1>
        <p className={s.pageSubtitle}>
          Review and approve new seller registration requests.
        </p>
      </div>

      {error && (
        <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>
      )}

      <div className={s.card}>
        <div className={s.cardInner}>
          <h2 className={s.sectionTitle}>
            Pending Requests ({requests.length})
          </h2>

          {requests.length === 0 ? (
            <div className={s.emptyState}>
              <HiOutlineCheckCircle size={48} className={s.emptyStateIcon} />
              <p>No pending seller requests at the moment.</p>
            </div>
          ) : (
            <div className={s.requestGrid}>
              {requests.map((request) => (
                <div key={request._id} className={s.requestCard}>
                  <div className={s.requestHeader}>
                    <div className={s.avatar}>
                      {request.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                      <div className={s.requestName}>{request.name}</div>
                      <div className={s.requestDate}>
                        <HiOutlineClock /> Joined on{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className={s.contactInfo}>
                    <div className={s.contactItem}>
                      <HiOutlineMail size={18} className='text-primary' />{" "}
                      {request.email}
                    </div>
                    {request.phone && (
                      <div className={s.contactItem}>
                        <HiOutlinePhone size={18} className='text-primary' />{" "}
                        {request.phone}
                      </div>
                    )}
                  </div>

                  <button onClick={() => handleApprove(request._id)} className={s.approveButton}>
                    <HiOutlineCheckCircle size={20} />
                    Approve Seller
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page