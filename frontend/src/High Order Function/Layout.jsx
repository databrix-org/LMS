import React, { useEffect, useCallback } from "react";
import Navbar from "../Component/navbar";
import Alert from "../Component/alert";
import { connect } from "react-redux";
import { verify, getUser, googleLogin } from "../reducer/Actions";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

const Layout = ({ message, children, verify, getUser, googleLogin }) => {
    const location = useLocation();

    const handleAuth = useCallback((code) => {
        if (code) {
            googleLogin(code);
        } else {
            verify();
            getUser();
        }
    }, [verify, getUser, googleLogin]);

    useEffect(() => {
        const values = queryString.parse(location.search);
        const code = values.code;
        handleAuth(code);
    }, [location, handleAuth]);

    return (
        <div>
            <Navbar />
            <div className="main-content">
                {children}
            </div>
            {message && <Alert message={message} />}
        </div>
    );
};

const mapStateToProps = (state) => ({
    message: state.AuthReducer.message,
    access: state.AuthReducer.access,
    refresh: state.AuthReducer.refresh,
    isAuthenticated: state.AuthReducer.isAuthenticated,
    user: state.AuthReducer.user
});

export default connect(mapStateToProps, { verify, getUser, googleLogin })(Layout);