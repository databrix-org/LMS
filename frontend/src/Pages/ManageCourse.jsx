import React from 'react';
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import CourseCreationForm from '../Components/Instructor/CourseCreationForm';

const ManageCourse = ({ isAuthenticated, user }) => {
    const navigate = useNavigate();

    if (!isAuthenticated || !user.is_instructor) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="manage-course-page">
            <CourseCreationForm 
                onClose={() => navigate('/instructor')}
                onCourseCreated={(newCourse) => {
                    // Handle the new course creation
                    navigate('/instructor');
                }}
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.AuthReducer.isAuthenticated,
    user: state.AuthReducer.user
});

export default connect(mapStateToProps)(ManageCourse); 