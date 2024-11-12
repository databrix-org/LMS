import TYPE from "./Type";
import axios from "axios";
axios.defaults.withCredentials = true

// Helper functions for token management
const getToken = () => {
    try {
        return localStorage.getItem('access');
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
    }
};

const setToken = (token) => {
    try {
        localStorage.setItem('access', token);
    } catch (error) {
        console.error("Error setting token in localStorage:", error);
    }
};

const removeToken = () => {
    try {
        localStorage.removeItem('access');
    } catch (error) {
        console.error("Error removing token from localStorage:", error);
    }
};


export const closeAlert = () => dispatch => {
    dispatch({
        type: TYPE.CLOSE_ALERT
    })
}

export const login = ( email, password ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({
        email: email,
        password: password
    });
    
    console.log('Login Request Body:', body);
    
    try {
        const res = await axios.post("http://localhost:8000/dj-rest-auth/login/", body, config);
        console.log('Login Response:', res.data);
        setToken(res.data.access);
        dispatch({
            type: TYPE.LOGIN_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        console.error('Login Error:', err.response?.data);
        dispatch({
            type: TYPE.LOGIN_FAIL
        });
    }
};

export const verify = () => async dispatch => {
    const token = getToken();
    if ( token ) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const body = JSON.stringify({ "token": localStorage.getItem('access') });
        try {
            await axios.post("http://localhost:8000/dj-rest-auth/token/verify/", body, config);
            dispatch ({
                type: TYPE.VERIFY_SUCCESS
            });
        } catch (err) {
            dispatch ({
                type: TYPE.VERIFY_FAIL
            });
            await dispatch ( refresh() );
        }
    } else {
        dispatch ({
            type: TYPE.GUEST_VIEW
        });
    }
};

export const getUser = () => async dispatch => {
    const token = getToken();
    if ( token ) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ localStorage.getItem('access') }`
            }
        };
        try {
            const res = await axios.get("http://localhost:8000/dj-rest-auth/user/", config);
            dispatch ({
                type: TYPE.GET_USER_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch ({
                type: TYPE.GET_USER_FAIL
            });
        }
    } else {
        dispatch ({
            type: TYPE.GUEST_VIEW
        });
    }
}

export const refresh = () => async dispatch => {
    const token = getToken();
    if ( token ) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const res = await axios.post("http://localhost:8000/dj-rest-auth/token/refresh/", config);
            console.log(res.data);
            dispatch ({
                type: TYPE.REFRESH_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            console.log(err);
            dispatch ({
                type: TYPE.REFRESH_FAIL
            })
        }
    } else {
        dispatch ({
            type: TYPE.GUEST_VIEW
        })
    }
}

export const changePassword = ( new_password1, new_password2, old_password ) => async dispatch => {
    await dispatch ( verify() );
    const token = getToken();
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };
    const body = JSON.stringify({ new_password1, new_password2, old_password });
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/password/change/", body, config);
        dispatch ({
            type: TYPE.CHANGE_PASSWORD_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.CHANGE_PASSWORD_FAIL
        });
    }
}

export const logout = () => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/logout/", config);
        removeToken();
        dispatch ({
            type: TYPE.LOGOUT
        });
    } catch (err) {
        removeToken();
        dispatch ({
            type: TYPE.LOGOUT
        });
    }
}

export const signup = ( email, first_name, last_name, password1, password2 ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email, first_name, last_name, password1, password2 });
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/registration/", body, config);
        dispatch ({
            type: TYPE.SIGNUP_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.SIGNUP_FAIL
        });
    };
};

export const emailVerification = ( key ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ key });
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/registration/verify-email/", body, config);
        dispatch ({
            type: TYPE.ACTIVATE_ACCTOUNT_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.ACTIVATE_ACCTOUNT_FAIL
        });
    };
};

export const resetPassword = ( email ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email });
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/password/reset/", body, config);
        dispatch ({
            type: TYPE.RESET_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.RESET_FAIL
        });
    };
};

export const resetPasswordConfirm = ( uid, token, new_password1, new_password2 ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ uid, token, new_password1, new_password2 });
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/password/reset/confirm/", body, config);
        dispatch ({
            type: TYPE.SET_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.SET_FAIL
        });
    };
};

export const googleLogin = ( code ) => async dispatch => {
    if ( !getToken() ) {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const body = JSON.stringify({ code })
        try {
            const res = await axios.post("http://localhost:8000/dj-rest-auth/google/", body, config)
            setToken(res.data.access);
            dispatch ({
                type: TYPE.LOGIN_SUCCESS,
                payload: res.data
            })
        } catch (err) {
            dispatch ({
                type: TYPE.LOGIN_FAIL
            })
        }
    } else {
        dispatch( verify() );
        dispatch( getUser() );
    }
}


// const getCookie = (cookieName) => {
        //     const name = cookieName + "=";
        //     const cookies = decodeURIComponent(document.cookie).split(";");
        //     let result;
        //     cookies.forEach(value => {
        //         if ( value.indexOf(name) === 0 ) {
        //             result = value.substring(name.length)
        //         }
        //     });
        //     return result
        // };