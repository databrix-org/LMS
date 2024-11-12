import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../services/api';
import { connect } from "react-redux";
import '../css/settings.css';

const ProfileForm = ({ formData, setFormData, isSubmitting, onSubmit }) => (
    <div className="settings-card">
        <div className="settings-card-header">
            <h3>Profile details</h3>
        </div>
        <div className="settings-card-body">
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName">First name</label>
                        <input
                            id="firstName"
                            type="text"
                            className="form-control"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName">Last name</label>
                        <input
                            id="lastName"
                            type="text"
                            className="form-control"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                    </div>
                </div>
                <div className="text-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
);

const EmailSection = ({ email }) => (
    <div className="settings-card">
        <div className="settings-card-header">
            <h3>Email</h3>
        </div>
        <div className="settings-card-body">
            <p>{email}</p>
        </div>
    </div>
);

const LoginManagement = () => (
    <div className="settings-card">
        <div className="settings-card-header">
            <div className="settings-card-header-content">
                <h3>Login Management</h3>
                
            </div>
        </div>
        <div className="settings-card-body">
            <p className="text-muted">
                Sign out across all browsers. You will need to sign back in anywhere you'd like to use the application.
            </p>
            <button className="btn btn-secondary">Sign Out Everywhere</button>
        </div>
    </div>
);

const DeleteAccountSection = ({ onDeleteAccount }) => (
    <div className="settings-card">
        <div className="settings-card-header">
            <div className="settings-card-header-content">
                <h3>Delete account</h3>

            </div>
        </div>
        <div className="settings-card-body">
            <p className="text-muted">
                Deleting your account is permanent, and all of your courses and data will be deleted.
            </p>
            <button onClick={onDeleteAccount} className="btn btn-danger">
                    Delete Account
            </button>
        </div>
    </div>
);

const Settings = ({ isAuthenticated, user }) => {
    const navigate = useNavigate();

    console.log(user);
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
            });
        }
    }, [user]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await updateUserProfile(formData);
            // Show success message
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Add your API call to delete account
            console.log('Delete account');
        }
    };

    return (
        <div className="main-wrapper" style={{ 
            marginLeft: '250px', 
            padding: '20px'
        }}>
            <div className="settings-container" style={{ padding: '20px' }}>
                <h2>General</h2>
                
                <ProfileForm 
                    formData={formData}
                    setFormData={setFormData}
                    isSubmitting={isSubmitting}
                    onSubmit={handleProfileUpdate}
                />
                
                <EmailSection email={user?.email} />
                
                <LoginManagement />
                
                <DeleteAccountSection onDeleteAccount={handleDeleteAccount} />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.AuthReducer.isAuthenticated,
    user: state.AuthReducer.user
});

export default connect(mapStateToProps, {})(Settings);