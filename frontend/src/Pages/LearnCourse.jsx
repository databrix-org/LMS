import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import '../css/LearnCourse.css';
import LessonList from '../Component/LessonList';
import CourseSidebar from '../Component/CourseSidebar';
import { connect } from 'react-redux';
import LessonContent from '../Component/LessonContent';

const LearnCourse = ({ isAuthenticated, user }) => {
    const [courseStatus, setCourseStatus] = useState({});
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [course, setCourse] = useState(null);
    const { courseId } = useParams();

    const updateCourseStatus = useCallback(async () => {
        const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/progress/`);
        return response.data;
    }, [courseId]);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                // Check if user is enrolled or is instructor
                const enrollmentsResponse = await axios.get('http://localhost:8000/api/enrollments/');
                const courseResponse = await axios.get(`http://localhost:8000/api/courses/${courseId}/`);
                
                const isEnrolled = enrollmentsResponse.data.some(
                    enrollment => enrollment.course.id === parseInt(courseId)
                );
                const isInstructor = courseResponse.data.instructor === user;
                
                setHasAccess(isEnrolled || isInstructor);
                
                if (isEnrolled || isInstructor) {
                    // Fetch course content
                    const contentResponse = await axios.get(`http://localhost:8000/api/courses/${courseId}/content/`);
                    const courseData = contentResponse.data;
                    setCourse(courseData);
                   
                    const modules = courseData.modules;

                    // Fix: Await the course status update
                    const status = await updateCourseStatus();
                    setCourseStatus(status);
                    setSelectedModule(modules[0]);
                    setSelectedLesson(null);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error checking access:', error);
                setLoading(false);
            }
        };

        checkAccess();
    }, [courseId, user, updateCourseStatus]);

    if (!isAuthenticated){
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!hasAccess) {
        return <Navigate to={`/course/${courseId}`} />;
    }

    const NextLesson = async (course) => {

        const is_last_module = course.modules[course.modules.length - 1].id === selectedModule.id;
        const is_last_lesson = selectedModule.lessons[selectedModule.lessons.length - 1].id === selectedLesson.id;
        
        if (!is_last_lesson ) {
            const nextLesson = selectedModule.lessons.find(lesson => lesson.id === selectedLesson.id + 1);
            setSelectedLesson(nextLesson);
        }

        else if (is_last_lesson && !is_last_module) {
            const nextModule = course.modules.find(module => module.id === selectedModule.id + 1);
            setSelectedModule(nextModule);
            setSelectedLesson(null);

        }

        else if (is_last_lesson && is_last_module) {
            setSelectedLesson(null);
            setSelectedModule(null);
        }

        const status = await updateCourseStatus();
        setCourseStatus(status);
    }

    return (
        <div>
            <CourseSidebar 
                course={course}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
                setSelectedLesson={setSelectedLesson}
                courseStatus={courseStatus}
            />
            <div>
                {selectedLesson ? (
                    <LessonContent 
                        lesson={selectedLesson}
                        NextLesson={NextLesson}
                        courseStatus={courseStatus}
                    />
                ) : (
                    <LessonList 
                        selectedModule={selectedModule} 
                        setSelectedLesson={setSelectedLesson}
                        courseStatus={courseStatus}
                    />
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated,
        user: state.AuthReducer.user // Make sure this is available in your state
    }
}
export default connect(mapStateToProps, {})(LearnCourse); 