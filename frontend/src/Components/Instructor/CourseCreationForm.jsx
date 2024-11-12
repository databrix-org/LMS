import React, { useState } from 'react';
import ModuleCreationForm from './ModuleCreationForm';

const CourseCreationForm = ({ onClose, onCourseCreated }) => {
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        difficulty_level: '1'
    });
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [modules, setModules] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // API call to create course
        try {
            const response = await fetch('/api/courses/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add your authentication headers here
                },
                body: JSON.stringify(courseData)
            });
            const data = await response.json();
            onCourseCreated(data);
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    return (
        <div className="course-creation-form">
            <h2>Create New Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={courseData.title}
                        onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                        required
                    />
                </div>
                {/* Add other form fields */}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Create Course</button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                </div>
            </form>

            {showModuleForm && (
                <ModuleCreationForm 
                    onClose={() => setShowModuleForm(false)}
                    onModuleCreated={(newModule) => {
                        setModules([...modules, newModule]);
                        setShowModuleForm(false);
                    }}
                />
            )}

            <div className="modules-list">
                {modules.map((module, index) => (
                    <div key={index} className="module-item">
                        <h3>{module.title}</h3>
                        <button onClick={() => setShowModuleForm(true)}>
                            Add Lesson
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseCreationForm; 