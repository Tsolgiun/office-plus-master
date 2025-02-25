import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faTimes, faUser, faCaretDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo/Logo';
import './Header.css';

const Header = ({ onSearch, searchValue }) => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchValue || '');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const location = useLocation();

    const isHomePage = location.pathname === '/';
    const isDetailsPage = location.pathname.includes('/office/');
    
    const handleScroll = useCallback(() => {
        setIsScrolled(window.pageYOffset > 100);
    }, []);

    useEffect(() => {
        if (isHomePage) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            setIsScrolled(false);
        }
    }, [handleScroll, isHomePage]);

    useEffect(() => {
        const observerOptions = {
            rootMargin: '-80px 0px 0px 0px',
            threshold: 0.5
        };

        const handleIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        // Observe sections with IDs
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
        setIsMobileMenuOpen(false);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
        setIsMobileMenuOpen(false);
    };

    // Update local search term when prop changes
    useEffect(() => {
        setSearchTerm(searchValue || '');
    }, [searchValue]);

    return (
        <header className={`header ${isHomePage ? (isScrolled ? 'scrolled' : '') : ''} ${isMobileMenuOpen ? 'menu-open' : ''} ${!isScrolled ? 'transparent' : ''} ${isDetailsPage ? 'details-page' : ''}`}>
            <div className="header-content">
                <div className="compact-nav">
                    <div className="logo-container">
                    <Link to="/">
                        <Logo variant="horizontal-dark" className="logo-md" />
                    </Link>
                </div>
                    <button 
                        className="mobile-menu-toggle" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                    </button>

                    <div className={`search-container ${isMobileMenuOpen ? 'mobile-visible' : ''}`}>
                        <form className="search-bar" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="按位置或办公室类型搜索..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>
                    </div>
                    <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-visible' : ''}`}>
                        {isAuthenticated ? (
                            <div className="user-menu-container" ref={userMenuRef}>
                                <button 
                                    className="user-menu-button"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    {user?.profile?.firstName}
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </button>
                                {showUserMenu && (
                                    <div className="user-menu">
                                        <Link 
                                            to="/profile" 
                                            className="user-menu-item"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <FontAwesomeIcon icon={faUser} />
                                            个人资料
                                        </Link>
                                        <button 
                                            className="user-menu-item"
                                            onClick={() => {
                                                logout();
                                                setShowUserMenu(false);
                                                navigate('/');
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            退出登录
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="login-button">
                                <FontAwesomeIcon icon={faUser} />
                                登录
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
