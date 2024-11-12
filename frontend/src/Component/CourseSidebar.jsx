import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../css/CourseSidebar.css';
import { Navigate } from 'react-router-dom';

const CourseSidebar = ({ course, selectedModule, setSelectedModule, setSelectedLesson, courseStatus }) => {

    function isModuleComplete(module) {
        for (const lessonId in courseStatus[module.id]) {
            if (!courseStatus[module.id][lessonId]) {
                return false;
            }
        }
        return true;
    }
    
    return (
        <div className="course-sidebar">
            <div className="sidebar-header">
                <h3>{course.title}</h3>
            </div>
            <div className="modules-list">
                {selectedModule ? (
                    course.modules.map((module) => (
                        <div 
                        key={module.id}
                        className={`module-item ${selectedModule.id === module.id ? 'selected' : ''}`}
                        onClick={() => {
                            setSelectedModule(module);
                            setSelectedLesson(null);
                        }}
                        >
                        <div className={`module-status-icon ${isModuleComplete(module) ? 'completed' : 'incomplete'}`}>
                            <FaCheckCircle />
                        </div>
                        <span>{module.title}</span>
                        </div>
                    ))
                ) : (
                    <Navigate to="/home" />
                )}
            </div>
        </div>
    );
};

export default CourseSidebar; 