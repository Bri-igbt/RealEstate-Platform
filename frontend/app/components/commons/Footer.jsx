'use client'

import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa'
import { landingPageStyles as s } from '@/assets/dummyStyles.js'
import { HiLocationMarker, HiMail, HiPhone } from 'react-icons/hi'
import Image from 'next/image.js'
import logo from '@/assets/hexagonlogo1.png'

const Footer = () => {
    return (
        <footer className={s.footer}>
            <div className={s.container}>
                <div className={s.footerMainGrid}>
                    <div className={s.footerBrand}>
                        <div className={s.brandLogo}>
                            <div className={s.brandIcon}>RE</div>
                            RealEstate
                        </div>
                        <p className={s.brandDesc}>
                            The most trusted platform for buying, selling and renting premium real estate
                            globally. We make property hunting seamless.
                        </p>
                        <div className={s.socialIcons}>
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                                <a href="#" key={idx} className={s.socialIcon}>
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className={s.footerHeading}>Company</h4>
                        <ul className={s.footerLinks}>
                            <li>
                                <a href="/" className={s.footerLink}>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/properties" className={s.footerLink}>
                                    Property
                                </a>
                            </li>
                            <li>
                                <a href="/wishlist" className={s.footerLink}>
                                    Wishlist
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className={s.footerLink}>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h4 className={s.footerHeading}>Support</h4>
                        <ul className={s.footerLinks}>
                            <li className={s.contactInfo}>
                                <HiMail className="text-primary text-xl" />{" "}
                                quest@reestate.com
                            </li>
                            <li className={s.contactInfo}>
                                <HiPhone className="text-primary text-xl" /> +234 8138081564
                            </li>
                            <li className={s.contactInfoStart}>
                                <HiLocationMarker
                                    className={`text-primary ${s.contactIcon}`}
                                />
                                123 Business Hub, Nigeria
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={s.footerHeading}>
                            Newsletter
                        </h4>
                        <p className={s.newsletterDesc}>
                            Subscibe to get the latest listings and market insights directly in your inbox.
                        </p>
                        <div className={s.newsletterInputWrapper}>
                            <input 
                                type="email"
                                placeholder='Enter Your Email'
                                className={s.newsletterInput}
                            />
                            <button className={s.newsletterButton}>Join</button>
                        </div>
                    </div>
                </div>

                <div className={s.bottomBar}>
                    <div className={s.bottomBarFlex}>
                        <p>&copy; {new Date().getFullYear()} RealEstate. All rights reserved.</p>
                        <div className={s.footerLegalLinks}>
                            <a href="#" className={s.footerLink}>Privacy Policy</a>
                            <a href="#" className={s.footerLink}>Terms of Service </a>
                            <a href="#" className={s.footerLink}>Cookies Settings</a>
                        </div>
                    </div>

                    <div className={s.designCredit}>
                        <Image 
                            src={logo}
                            className={s.designLogo}
                            alt='logo'
                        />
                        <span className='text-text-muted'>Designed By</span>
                        <a 
                            href="https://cbright.vercel.app/"
                            target='_blank'
                            className={s.designLink}
                        >
                            Stack Quest Digital Solution
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
