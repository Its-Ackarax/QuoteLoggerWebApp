import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import "../../styles/NavBar.css"

function NavBar() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 640) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <h1 className="menu-app-title">QuoteLogger</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                    <ul className="menu-buttons desktop">
                        <li>
                            <NavLink to="/" className={({isActive}) => `menu-button ${isActive ? 'active' : ''}`}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/books" className={({isActive}) => `menu-button ${isActive ? 'active' : ''}`}>
                                Books
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/quotes" className={({isActive}) => `menu-button ${isActive ? 'active' : ''}`}>
                                Quotes
                            </NavLink>
                        </li>
                    </ul>
                    <div className="theme-toggle-desktop-wrapper">
                        <ThemeToggle />
                    </div>
                </div>

                <button
                    className={`hamburger ${open ? 'is-open' : ''}`}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen(!open)}
                >
                    <span className="hamburger-box">
                        <span className="hamburger-inner" />
                    </span>
                </button>
            </div>

            <ul id="mobile-menu" className={`menu-buttons mobile ${open ? 'open' : ''}`}>
                <li>
                    <NavLink to="/" className={({isActive}) => `menu-button ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/books" className={({isActive}) => `menu-button ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>Books</NavLink>
                </li>
                <li>
                    <NavLink to="/quotes" className={({isActive}) => `menu-button ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>Quotes</NavLink>
                </li>
                <li>
                    <ThemeToggle />
                </li>
            </ul>
        </nav>
    );
}

export default NavBar