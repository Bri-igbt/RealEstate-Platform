'use client'

import { useAuth } from "@/context/AuthContext.jsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    const isGuestAllowed = allowedRoles?.includes(undefined);

    useEffect(() => {
        if (loading) return;

        if (!user && !isGuestAllowed) {
            router.replace("/login");
            return;
        }

        if (user && allowedRoles && !allowedRoles.includes(user.role)) {
            if (user.role === "admin") {
                router.replace("/admin-dashboard");
            } else if (user.role === "seller") {
                router.replace("/dashboard");
            } else {
                router.replace("/");
            }
        }
    }, [user, loading, allowedRoles, isGuestAllowed, router]);

    if (loading) {
        return (
            <div className="flex justify-center p-25">
                <div className="loader"></div>
            </div>
        );
    }

    if (!user && !isGuestAllowed) return null;
    if (user && allowedRoles && !allowedRoles.includes(user.role)) return null;

    return <>{children}</>;
};

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (user) {
            if (user.role === "admin") {
                router.replace("/admin-dashboard");
            } else if (user.role === "seller") {
                router.replace("/dashboard");
            } else {
                router.replace("/");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center p-25">
                <div className="loader"></div>
            </div>
        );
    }

    if (user) return null;

    return <>{children}</>;
};