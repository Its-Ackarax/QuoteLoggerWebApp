import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/NavBar.css"

function NavBar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <h1 className="menu-app-title">QuoteLogger</h1>

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
            </ul>
        </nav>
    );
}

export default NavBar