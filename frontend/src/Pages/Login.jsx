import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { connect } from "react-redux";
import { login } from "../reducer/Actions";
import '../css/Login.css';

const Login = ({ login, isAuthenticated }) => {
    console.log(isAuthenticated);
    const [ formData, setFormData ] = useState ({
        email: "",
        password: ""
    });
    const { email, password } = formData;
    const handlingInput = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handlingSubmit = (e) => {
        e.preventDefault();
        login( email, password );
    }
    const reachGoogle = () => {
        const clientID = "Client Id Oauth google";
        const callBackURI = "http://localhost:3000/";
        window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${clientID}&scope=openid%20email%20profile&access_type=offline`)
    }
    if (isAuthenticated) {
        return <Navigate to={"../mycourses"}></Navigate>
    }
    return (
        <div className="login-container">
            <div className="login-image">
                <img src="/Image/home_narrow.png" alt="AI Platform" />
            </div>
            <div className="login-form-area">
                <h2 className="text-center mb-4">Log In</h2>

                <form className="mb-3" onSubmit={e => handlingSubmit(e)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input name="email" value={email} onChange={e => handlingInput(e)} 
                               type="email" className="form-control" id="email" 
                               placeholder="Enter email"/>
                    </div>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Link to="../reset/password/" className="text-decoration-none">Forgot password?</Link>
                        </div>
                        <input name="password" value={password} onChange={e => handlingInput(e)} 
                               type="password" className="form-control" id="password" 
                               placeholder="Enter password"/>
                    </div>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary" type="submit">Log In</button>
                    </div>
                </form>
                
                <p className="text-center">
                    Don't have an account? <Link to="../signup/">Create one</Link>
                </p>
            </div>
        </div>
    )
}

const mapStateToProps = ( state ) => {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated
    }
}

export default connect(mapStateToProps, { login })(Login)