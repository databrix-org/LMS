import React, { useState } from 'react';

const LessonCreationForm = ({ onClose, onLessonCreated, moduleId }) => {
    const [lessonData, setLessonData] = useState({
        title: '',
        description: '',
        lesson_type: 'reading',
        duration: 10,
        order: 1,
        video_url: '',
        lesson_content: '',
        additional_resources: '',
        exercise: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/modules/${moduleId}/lessons/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add your authentication headers here
                },
                body: JSON.stringify(lessonData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create lesson');
            }
            
            const data = await response.json();
            onLessonCreated(data);
            onClose();
        } catch (error) {
            console.error('Error creating lesson:', error);
            // Add error handling UI feedback here
        }
    };

    return (
        <div className="lesson-creation-form">
            <div className="form-header">
                <h3>Create New Lesson</h3>
                <button 
                    className="close-button"
                    onClick={onClose}
                >×</button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        className="form-control"
                        value={lessonData.title}
                        onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
                        required
                    />
                </div>

                {/* Lesson Type */}
                <div className="form-group">
                    <label htmlFor="lesson_type">Lesson Type</label>
                    <select
                        id="lesson_type"
                        className="form-control"
                        value={lessonData.lesson_type}
                        onChange={(e) => setLessonData({...lessonData, lesson_type: e.target.value})}
                    >
                        <option value="reading">Reading Material</option>
                        <option value="video">Video Lesson</option>
                        <option value="exercise">Practice Exercise</option>
                    </select>
                </div>

                {/* Duration (in minutes) */}
                <div className="form-group">
                    <label htmlFor="duration">Duration (minutes)</label>
                    <input
                        id="duration"
                        type="number"
                        className="form-control"
                        value={lessonData.duration}
                        onChange={(e) => setLessonData({...lessonData, duration: parseInt(e.target.value)})}
                        min="1"
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={lessonData.description}
                        onChange={(e) => setLessonData({...lessonData, description: e.target.value})}
                        rows="3"
                    />
                </div>

                {/* Conditional fields based on lesson type */}
                {lessonData.lesson_type === 'video' && (
                    <div className="form-group">
                        <label htmlFor="video_url">Video URL</label>
                        <input
                            id="video_url"
                            type="url"
                            className="form-control"
                            value={lessonData.video_url}
                            onChange={(e) => setLessonData({...lessonData, video_url: e.target.value})}
                        />
                    </div>
                )}

                {lessonData.lesson_type === 'reading' && (
                    <div className="form-group">
                        <label htmlFor="lesson_content">Lesson Content</label>
                        <textarea
                            id="lesson_content"
                            className="form-control"
                            value={lessonData.lesson_content}
                            onChange={(e) => setLessonData({...lessonData, lesson_content: e.target.value})}
                            rows="5"
                        />
                    </div>
                )}

                {lessonData.lesson_type === 'exercise' && (
                    <div className="form-group">
                        <label htmlFor="exercise">Exercise Content</label>
                        <textarea
                            id="exercise"
                            className="form-control"
                            value={lessonData.exercise}
                            onChange={(e) => setLessonData({...lessonData, exercise: e.target.value})}
                            rows="5"
                        />
                    </div>
                )}

                {/* Additional Resources */}
                <div className="form-group">
                    <label htmlFor="additional_resources">Additional Resources</label>
                    <textarea
                        id="additional_resources"
                        className="form-control"
                        value={lessonData.additional_resources}
                        onChange={(e) => setLessonData({...lessonData, additional_resources: e.target.value})}
                        rows="3"
                        placeholder="Add any additional resources or links..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Create Lesson
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LessonCreationForm; 