'use client'

import React, { useEffect, useState } from 'react'
import { myInquiriesStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import API_URL from '@/config.js'
import Navbar from '@/app/components/commons/Navbar.jsx'
import { HiCalendar, HiChatAlt2, HiCheckCircle, HiExternalLink, HiHome, HiMail, HiOutlineChatAlt2, HiUser } from 'react-icons/hi'
import Link from 'next/link'

const page = () => {
    const {user, token} = useAuth();
    const router = useRouter();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInquiries = async (params) => {
            if(!user) return;
            try {
                const endpoint = user?.role === "seller" ? "seller" : "my";
                const res = await axios.get(`${API_URL}/api/inquiry/${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}`}
                });
                setInquiries(res.data.inquiries || []);
                setLoading(false);
                
            } catch (err) {
                console.error("Error fetching inquiries:", err);
                setError(false);
            }
        }
        fetchInquiries();
    },[user, token])

    const markAsRead = async (id) => {
        try {
            await axios.patch(
                `${API_URL}/api/inquiry/${id}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            ),
            setInquiries(
                inquiries.map((inq) => inq._id === id ? { ...inq, isRead: true } : inq),
            );
        } catch (error) {
            console.error("Failed to mark as read")
        }
    };

    const handleStartChat = async (inq) => {
        try {
            const res = await axios.post(
                `${API_URL}/api/chat/start`,
                {
                    propertyId: inq.property?._id,
                    buyerId: inq.buyer?._id,
                },
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );
            router.push("/seller/chat-messages", { state: { chat: res.data }});

        } catch (err) {
            console.error("Error starting chat:", err);
            alert("Failed to start chat. Please try again")
        }
    };

    if (loading) {
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        )
    };

    if(error){
        return (
            <div className={user?.role !== "seller" ? s.bgBgAltMinH : s.bgTransparentMinH}>
                {user?.role !== "seller" && <Navbar />}
                <div className={s.containerPy12TextCenter}>
                    <div className={s.cardPremiumPy16Px8}>
                        <h2 className={s.textDangerMb4}>Error</h2>
                        <p className={s.mb8}>{error}</p>
                        <button className={s.btnPrimary} onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    const isSeller = user?.role === "seller";

    return (
        <div className={user?.role !== "seller" ? s.bgBgAltMinH : s.bgTransparentHAuto}>
            {user?.role !== "seller" && <Navbar />}
            <div 
                className={`${s.containerFadeIn} ${
                    user?.role !== "seller" ? s.py12Pt12 : s.pt0
                }`}
            >
                <div className={s.mb12}>
                    <h1 className={s.heading}>
                        {isSeller ? "Customer Inquiries" : "My Inquiries"}
                    </h1>
                    <p className={s.textMuted}>
                        {
                            isSeller 
                                ? "Review and respond to interest in your properties."
                                : "Track the status of your property inquiries." 
                        }
                    </p>
                </div>

                {inquiries.length === 0 ? (
                    <div className={s.cardPremiumPy24Px8TextCenter}>
                        <div className={s.iconContainer}>
                            <HiOutlineChatAlt2 size={40} />
                        </div>
                        <h2 className={s.mb4}>
                            No Inquiries {isSeller ? "recieved" : "sent"}
                        </h2>
                        <p className={s.textMutedMb8}>
                            {
                                isSeller 
                                    ? "You haven't recieved an inquiries yet. Better listings get more attention!"
                                    : "You haven't contacted an sellers yet. Interested in a property? Send an inquiry"
                            }
                        </p>

                        <Link href='/' className={s.btnPrimary}>
                            {isSeller ? "Improve My Listings" : "Discover Properties"}
                        </Link>
                    </div>
                ) : (
                    <div className={s.flexColGap6}>
                        {inquiries.map((inq) => (
                            <div key={inq._id} className={s.inquiryCard}>
                                <div className={s.inquiryMain}>
                                    <div className={s.iconWrapper}>
                                        <HiHome className={s.iconSize} />
                                    </div>
                                    <div className={s.flex1}>
                                        <div className={s.titleRow}>
                                            <h3 className={s.titleText}>{inq.property?.title}</h3>
                                            <span className={`${s.badge} ${inq.isRead ? s.badgeRead : s.badgeNew}`}>
                                                {inq.isRead ? "READ" : "NEW"}
                                            </span>
                                        </div>

                                        {isSeller && (
                                            <div className={s.buyerInfo}>
                                                <div className={s.infoItem}>
                                                    <HiUser className={s.textMutedSmall} />{" "}
                                                    <span className={s.fontSemibold}>
                                                        {inq.buyer?.name}
                                                    </span>
                                                </div>

                                                <div className={s.infoItem}>
                                                    <HiMail className={s.textMutedSmall} />{" "}
                                                    {inq.buyer?.email}
                                                </div>
                                                <div className={s.infoItem}>
                                                    <HiMail className={s.textMutedSmall} />{" "}
                                                    {inq.buyer?.phone || "No phone provided"}
                                                </div>
                                            </div>
                                        )}

                                        <p className={s.message}>"{inq.message}"</p>
                                        <div className={s.meta}>
                                            <div className={s.flexItemsCenterGap2}>
                                                <HiCalendar size={16} />{" "}
                                                {isSeller ? "Recieved" : "Sent"} on{" "}
                                                {new Date(inq.createdAt).toLocaleDateString()}
                                            </div>

                                            {!isSeller && (
                                                <div className={s.flexItemsCenterGap2}>
                                                    <HiCheckCircle size={16} />{" "}
                                                    {inq.isRead ? "Seller viewed" : "Waiting for seller"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={s.actions}>
                                    <Link href={`/properties/${inq.property?._id}`} className={s.btnOutline}>
                                        View Property 
                                        <HiExternalLink />
                                    </Link>

                                    {isSeller && !inq.isRead && (
                                        <button
                                            onClick={() => markAsRead(inq._id)}
                                            className={s.btnPrimaryWhitespaceNowrap}
                                        >
                                            Mark as Read
                                        </button>
                                    )}

                                    {isSeller && (
                                        <button 
                                            onClick={() => handleStartChat(inq)}
                                            className={s.btnMessage}
                                        >
                                            <HiChatAlt2 />
                                            Message
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default page