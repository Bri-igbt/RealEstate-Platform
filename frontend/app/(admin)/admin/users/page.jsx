'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { adminUsersStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import axios from 'axios'
import API_URL from '@/config.js'
import {
    HiOutlineFilter,
    HiOutlineIdentification,
    HiOutlineLockClosed,
    HiOutlineLockOpen,
    HiOutlineMail,
    HiOutlineTrash
} from 'react-icons/hi'

const page = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleFilter, setRoleFilter] = useState("all");
    const [openFilter, setOpenFilter] = useState(false);

    const { token } = useAuth();
    const filterRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${API_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (res.data.success) {
                    setUsers(res.data.users);
                }
            } catch (err) {
                console.error("Failed to load users:", err);
                setError(err.response?.data?.message || "Failed to load users");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setOpenFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredUsers = useMemo(() => {
        if (roleFilter === "all") return users;
        return users.filter((user) => user.role === roleFilter);
    }, [users, roleFilter]);

    const handleBlock = async (id) => {
        try {
            const res = await axios.patch(`${API_URL}/api/admin/users/${id}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data.success) {
                setUsers(
                    users.map((u) => u._id === id ? { ...u, isBlocked: res.data.isBlocked } : u),
                )
            }

        } catch (error) {
            alert("Operation failed");
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete the user? This action cannot be undone")) {
            return;
        };

        try {
            await axios.delete(`${API_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter((u) => u._id !== id));
        } catch (error) {
            alert("Failed to delete user")
        }
    };

    if (loading) {
        return (
            <div className='loader-full-page'>
                <div className='loader' />
            </div>
        )
    }

    return (
        <>
            <div className={s.containerHeader}>
                <div>
                    <h1 className={s.headerTitle}>User Management</h1>
                    <p>
                        Monitor platform users and access levels.
                    </p>
                </div>

                <div className={s.filterWrapper} ref={filterRef}>
                    <button className={s.filterButton} onClick={() => setOpenFilter(!openFilter)}>
                        <HiOutlineFilter size={18} />
                        Filter
                    </button>

                    {openFilter && (
                        <div className={s.filterDropdown}>
                            <button
                                className={s.filterOption(roleFilter === "all")}
                                onClick={() => {
                                    setRoleFilter("all");
                                    setOpenFilter(false);
                                }}
                            >
                                All Users
                            </button>

                            <button
                                className={s.filterOption(roleFilter === "buyer")}
                                onClick={() => {
                                    setRoleFilter("buyer");
                                    setOpenFilter(false);
                                }}
                            >
                                Buyer
                            </button>

                            <button
                                className={s.filterOption(roleFilter === "seller")}
                                onClick={() => {
                                    setRoleFilter("seller");
                                    setOpenFilter(false);
                                }}
                            >
                                Seller
                            </button>

                            <button
                                className={s.filterOption(roleFilter === "admin")}
                                onClick={() => {
                                    setRoleFilter("admin");
                                    setOpenFilter(false);
                                }}
                            >
                                Admin
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={s.cardContainer}>
                <div className={s.cardHeader}>
                    <div className={s.cardTitleRow}>
                        <h2 className={s.cardTitle}>Platform Users</h2>
                        <div className={s.userCount}>
                            Showing{" "}
                            <span className={s.userCountSpan}>{filteredUsers.length}</span>{" "}
                            users
                        </div>
                    </div>
                </div>

                <div className={s.tableWrapper}>
                    <table className={s.table}>
                        <thead className={s.thead}>
                            <tr className={s.tableRow}>
                                <th className={s.thUserInfo}>User Info</th>
                                <th className={s.thRole}>Role</th>
                                <th className={s.thContact}>Contact Details</th>
                                <th className={s.thStatus}>Account Status</th>
                                <th className={s.thActions}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr className={s.tableRow} key={user._id}>
                                        <td className={s.tdUserInfo}>
                                            <div className='flex items-center gap-4'>
                                                <div className={s.userAvatar}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className={s.userInfoName}>{user.name}</div>
                                                    <div className={s.userInfoId}>
                                                        ID: {user._id.slice(-8).toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className={s.tdRole}>
                                            <span className={s.roleBadge(user.role)}>{user.role}</span>
                                        </td>

                                        <td className={s.tdContact}>
                                            <div className={s.contactWrapper}>
                                                <div className={s.contactEmail}>
                                                    <HiOutlineMail color='#94a2b8' />
                                                    {user.email}
                                                </div>

                                                {user.phone && (
                                                    <div className={s.contactPhone}>
                                                        <HiOutlineIdentification color='#94a3b8' /> {" "}
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className={s.tdStatus}>
                                            {user.isBlocked ? (
                                                <span className={s.statusBadgeBlocked}>
                                                    <HiOutlineLockClosed size={14} />
                                                    Suspended
                                                </span>
                                            ) : (
                                                <span className={s.statusBadgeActive}>
                                                    <HiOutlineLockOpen size={14} />
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        <td className={s.tdActions}>
                                            <div className={s.actionsWrapper}>
                                                <button
                                                    onClick={() => handleBlock(user._id)}
                                                    className={s.blockButton(user.isBlocked)}
                                                    title={user.isBlocked ? "Unblock User" : "Block User"}
                                                >
                                                    {user.isBlocked ? (
                                                        <HiOutlineLockOpen size={18} />
                                                    ) : (
                                                        <HiOutlineLockClosed size={18} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className={s.deleteButton}
                                                    title='Delete User'
                                                >
                                                    <HiOutlineTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className={s.emptyState} colSpan={5}>
                                        No users found for this filter
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default page

