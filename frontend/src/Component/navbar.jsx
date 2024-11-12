import React, { useState } from "react";
import { Link, Navigate, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../reducer/Actions";
import { FaCog, FaSearch, FaPlus } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import '../css/navbar.css';

const Navbar = ({ logout, isAuthenticated, user }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    if (!isAuthenticated) {
        return <Navigate to="../login" />;
    }

    if (!user) {
        return null;
    }

    const userInitial = user.firstName?.charAt(0) || 'U';

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <div className="navbar-top-content">
                    <div className="navbar-left">
                        <h3 className="mb-0 navbar-title">Databrix Lab</h3>
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="user-menu-container">
                        <div 
                            className="user-menu-trigger"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <button className="user-icon">
                                {userInitial}
                            </button>
                            <span className="dropdown-arrow">▼</span>
                        </div>
                        
                        {showDropdown && (
                            <div className="user-dropdown">
                                {user && user.is_instructor && (
                                    <Link 
                                        to="/instructor/managecourse"
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <FaPlus className="me-2" />
                                        <span>Create Course</span>
                                    </Link>
                                )}
                                <Link 
                                    to="/settings"
                                    className="dropdown-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <FaCog className="me-2" />
                                    <span>Settings</span>
                                </Link>
                                <button 
                                    onClick={() => {
                                        setShowDropdown(false);
                                        logout();
                                    }} 
                                    className="dropdown-item"
                                >
                                    <FiLogOut className="me-2" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="nav-links-container">
                <div className="container-fluid px-0">
                    <div className="nav-links">
                        <NavLink to="/home" className="nav-link">
                            Home
                        </NavLink>
                        <NavLink to="/mycourses" className="nav-link">
                            My Learning
                        </NavLink>
                        {user.is_instructor && (
                            <NavLink to="/instructor" className="nav-link">
                                Instructor Dashboard
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated,
        user: state.AuthReducer.user // Make sure this is available in your state
    }
}

export default connect(mapStateToProps, { logout })(Navbar);