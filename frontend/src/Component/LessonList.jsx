import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import '../css/LessonList.css';

const LessonList = ({ selectedModule, setSelectedLesson, courseStatus }) => {

    const formatDuration = (duration) => {
        if (!duration) return '10'; // Default value
        
        // Split timestamp into hours, minutes, seconds
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        
        // Convert everything to minutes and round up
        const totalMinutes = Math.ceil(hours * 60 + minutes + seconds / 60);
        return totalMinutes.toString();
    };

    const handleLessonClick = (lesson) => {
        setSelectedLesson(lesson);
    };

    if (!selectedModule) {
        return <div className="lesson-list">No module selected</div>;
    }

    if (!selectedModule.lessons) {
        return <div className="lesson-list">Loading lessons...</div>;
    }

    if (!courseStatus) {
        return <div className="lesson-list">Loading progress...</div>;
    }

    return (
        <div className="lesson-list">
            <div className="module-header">
                <div className="module-info">
                    <h2>{selectedModule.title}</h2>
                    <p className="module-description">
                        {selectedModule.description || 'No description available'}
                    </p>
                </div>
            </div>
            
            <div className="lessons-container">
                {selectedModule.lessons.map((lesson) => (
                    <div 
                        key={lesson.id} 
                        className="lesson-item"
                        onClick={() => handleLessonClick(lesson)}
                    >
                        {courseStatus[selectedModule.id]?.[lesson.id] ? (
                            <FaCheckCircle className="completed-icon" />
                        ) : (
                            <FaRegCircle className="incomplete-icon" />
                        )}
                        <div className="lesson-list-content">
                            <div className="lesson-list-title">{lesson.title}</div>
                            <div className="lesson-list-meta">
                                <span className="lesson-type">{lesson.lesson_type || 'Reading'}</span>
                                <span className="bullet">•</span>
                                <span>{formatDuration(lesson.duration)} min</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonList; 