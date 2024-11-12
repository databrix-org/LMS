import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('/api/courses/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                        'Content-Type': 'application/json',
                    }
                });
                // Filter courses to only show those created by the current instructor
                const instructorCourses = response.data.filter(course => course.instructor);
                setCourses(instructorCourses);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch courses');
                setLoading(false);
                console.error('Error fetching courses:', err);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (courses.length === 0) {
        return (
            <div className="no-courses-message">
                <p>You haven't created any courses yet.</p>
            </div>
        );
    }

    return (
        <div className="courses-list">
            <h2>Your Courses</h2>
            <div className="courses-grid">
                {courses.map((course) => (
                    <div key={course.id} className="course-card">
                        <div className="course-card-header">
                            <h3>{course.title}</h3>
                            <span className="difficulty-badge">
                                {course.difficulty_level_display}
                            </span>
                        </div>
                        <div className="course-card-body">
                            <p>{course.description}</p>
                            <div className="course-meta">
                                <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                                {course.categories?.length > 0 && (
                                    <div className="course-categories">
                                        {course.categories.map(category => (
                                            <span key={category.id} className="category-tag">
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="course-card-footer">
                            <Link 
                                to={`/course/${course.id}/edit`} 
                                className="btn btn-primary"
                            >
                                Edit Course
                            </Link>
                            <Link 
                                to={`/course/${course.id}/manage`} 
                                className="btn btn-secondary"
                            >
                                Manage Content
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList; 