import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import CourseList from '../Components/Instructor/CourseList';
import '../css/instructor.css';

const InstructorDashboard = ({ isAuthenticated, user }) => {
    const navigate = useNavigate();
    const [courses] = useState([]);

    // Simple checks
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!user) {
        return null; // Or a simple loading indicator
    }

    if (!user.is_instructor) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="instructor-dashboard">
            <div className="dashboard-header">
                <h1>Instructor Dashboard</h1>
                <button 
                    className="create-course-btn"
                    onClick={() => navigate('/instructor/managecourse')}
                >
                    Create New Course
                </button>
            </div>

            <CourseList courses={courses} />
        </div>
    );
};

const mapStateToProps = ( state ) => {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated,
        user: state.AuthReducer.user
    }
}

export default connect(mapStateToProps)(InstructorDashboard); 