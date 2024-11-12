import React, { useState } from 'react';
import LessonCreationForm from './LessonCreationForm';

const ModuleCreationForm = ({ onClose, onModuleCreated, courseId }) => {
    const [moduleData, setModuleData] = useState({
        title: '',
        description: '',
        order: 1
    });
    const [showLessonForm, setShowLessonForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/courses/${courseId}/modules/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add your authentication headers here
                },
                body: JSON.stringify(moduleData)
            });
            const data = await response.json();
            onModuleCreated(data);
        } catch (error) {
            console.error('Error creating module:', error);
        }
    };

    return (
        <div className="module-creation-form">
            <h3>Create New Module</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={moduleData.title}
                        onChange={(e) => setModuleData({...moduleData, title: e.target.value})}
                        required
                    />
                </div>
                {/* Add other form fields */}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Create Module</button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                </div>
            </form>

            {showLessonForm && (
                <LessonCreationForm 
                    onClose={() => setShowLessonForm(false)}
                    onLessonCreated={(newLesson) => {
                        // Handle new lesson
                        setShowLessonForm(false);
                    }}
                />
            )}
        </div>
    );
};

export default ModuleCreationForm; 