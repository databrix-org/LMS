import React from 'react';
import '../css/Home.css';
import '../css/mycourses.css';
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Courses = ({ isAuthenticated }) => {
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                
                const response = await axios.get('http://localhost:8000/api/enrollments');
                setEnrolledCourses(response.data);
                console.log(response.data);

            } catch (error) {
                console.error('Error fetching enrolled courses:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        if (isAuthenticated) {
            fetchEnrolledCourses();
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="courses-container">
            <div className="courses-content">
                <div className="row g-3">
                    {enrolledCourses.map((enrollment, index) => (
                        <div key={`course-${enrollment?.course?.id || index}`}>
                            <div className="card h-1 course-card">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{enrollment?.course?.title}</h5>
                                    <p className="card-text flex-grow-1">{enrollment?.course?.description}</p>
                                    <p className="difficulty">
                                        Difficulty: {(() => {
                                            switch(enrollment?.course?.difficulty_level) {
                                                case 1: return 'Beginner';
                                                case 2: return 'Intermediate';
                                                case 3: return 'Advanced';
                                                case 4: return 'Professional';
                                                default: return 'Unknown';
                                            }
                                        })()}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <button
                                            type="button"
                                            className="btn btn-primary px-4 py-2 rounded-pill"
                                            onClick={() => navigate(`/course/${enrollment?.course?.id}`)}
                                        >
                                            View Course
                                        </button>
                                    </div>
                                    <div className="progress-container">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: `${enrollment?.progress || 0}%` }}
                                            aria-valuenow={enrollment?.progress || 0}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                    <span className="progress-text">
                                        {enrollment?.progress || 0}% Complete
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = ( state ) => {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated
    }
}

export default connect(mapStateToProps, {})(Courses); 