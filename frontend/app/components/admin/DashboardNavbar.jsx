import React from 'react'
import { dashboardNavbarStyles as s } from '@/assets/dummyStyles.js'
import Logo from '@/app/components/commons/Logo.jsx'
import { HiMenuAlt2 } from 'react-icons/hi'

const DashboardNavbar = ({onMenuClick}) => {
    return (
        <header className={s.header}>
            <button className={s.menuButton} onClick={onMenuClick}>
                <HiMenuAlt2 size={24} />
            </button>

            <div className={s.logoContainer}>
                <Logo fontSize='1.25rem' iconSize={18} />
            </div>
        </header>
    )
}

export default DashboardNavbar
