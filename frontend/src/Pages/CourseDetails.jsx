import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CourseDetails.css';

const CourseDetails = () => {
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/content/`);
                setCourse(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const checkEnrollment = async () => {
            console.log('Checking enrollment for course:', courseId);
            const response = await axios.get('http://localhost:8000/api/enrollments');
            if (response.data.some(enrollment => enrollment.course.id === parseInt(courseId))) {
                setIsEnrolled(true);
            }
        };
        checkEnrollment();
    }, [courseId]);

    const handleEnroll = async () => {
        try {
            await axios.post(`http://localhost:8000/api/courses/${courseId}/enroll/`);
            setIsEnrolled(true);
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };

    const handleStartLearning = () => {
        navigate(`/course/${courseId}/learn`);
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="course-info">
                        <div className="info-grid">
                            <div className="info-card">
                                <p>Bauen Sie mit detaillierten Anweisungen gefragte Jobkompetenzen auf.</p>
                            </div>
                        </div>

                        <section className="learning-objectives">
                            <h2>Was Sie lernen werden</h2>
                            <ul className="objectives-list">
                                {course.objectives?.map((objective, index) => (
                                    <li key={index} className="objective-item">
                                        <span className="checkmark">✓</span>
                                        {objective}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                );
            case 'modules':
                return (
                    <div className="course-modules">
                        <h2>Kursmodule</h2>
                        <div className="modules-list">
                            {course.modules?.map((module, index) => (
                                <div key={index} className="module-overview-item">
                                    <h3>{module.title}</h3>
                                    <ul>
                                        {module.lessons?.map((lesson, lessonIndex) => (
                                            <li key={lessonIndex}>{lesson.title}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'details':
                return (
                    <div className="project-details">
                        <h2>Projektdetails</h2>
                        <p>{course.description}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="course-details-container">
            <div className="course-header">
                <div className="header-content">
                    <h1>{course.title}</h1>
                    <div className="provider-info">
                        <span>Dozent: {course.instructor?.first_name} {course.instructor?.last_name}</span>
                    </div>
                    <div className="course-actions">
                        {isEnrolled ? (
                            <button className="begin-project-btn" onClick={handleStartLearning}>Start Course</button>
                        ) : (
                            <button className="enroll-btn" onClick={handleEnroll}>Enroll Now</button>
                        )}  
                    </div>
                </div>
            </div>

            <div className="course-tabs">
                <button 
                    className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => handleTabClick('info')}
                >
                    Info
                </button>
                <button 
                    className={`tab-button ${activeTab === 'modules' ? 'active' : ''}`}
                    onClick={() => handleTabClick('modules')}
                >
                    Module
                </button>
                <button 
                    className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => handleTabClick('details')}
                >
                    Projektdetails
                </button>

            </div>

            {renderTabContent()}
        </div>
    );
};

export default CourseDetails; 