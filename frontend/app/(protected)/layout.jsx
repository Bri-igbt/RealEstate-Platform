import { useAuth } from "@/context/AuthContext.jsx"
import { Router } from "next/navigation";


const layout = ({ allowedRoles }) => {
    const {user, loading} = useAuth();

    if(loading){
        return (
            <div className="flex justify-center p-25">
                <div className="loader"></div>
            </div>
        );
    }

    const isGuestAllowed = allowedRoles?.includes(undefined);
    if(!user && !isGuestAllowed) {
        return <Router push="/login" replace />
    }

    if (user.)

    return (
        <div>
        
        </div>
    )
}

export default layout
