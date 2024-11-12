import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../css/LessonContent.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const LessonContent = ({ lesson, NextLesson, courseStatus }) => {
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const checkCompletion = async () => {
            const is_completed = courseStatus[lesson.module][lesson.id];
            setCompleted(is_completed);
        };
        checkCompletion();
    }, [courseStatus, lesson.module, lesson.id]);

    if (!lesson) {
        return <div>No lesson selected</div>;
    }

    const handleComplete = async () => {
        try {
            await axios.post(`http://localhost:8000/api/courses/${lesson.course_id}/modules/${lesson.module}/lessons/${lesson.id}/complete/`);
            setCompleted(true);
            const courseData = await axios.get(`http://localhost:8000/api/courses/${lesson.course_id}/content/`);

            NextLesson(courseData.data);
        } catch (error) {
            console.error('Error completing lesson:', error);
        }
    };

    return (
        <div className="lesson-content">
            <div className="lesson-header">
                <h1>{lesson.title}</h1>
            </div>

            <div className="lesson-body">
                {/* Directly render the video if video_url is present */}
                {lesson.video_url && (
                    <div className="video-container">
                        <video
                            width="560"
                            height="315"
                            controls
                            className="lesson-video"
                        >
                            <source src={`/videos/GenAIGrader-1080.mp4`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* If your content is markdown */}
                <ReactMarkdown
                    children={lesson.lesson_content}
                />

            </div>

            <div className="lesson-footer">
                {completed ? (
                    <button className="next-lesson" onClick={handleComplete}>
                        ✓ Completed
                    </button>
                ) : (
                    <button className="next-lesson" onClick={handleComplete}>
                        Complete
                    </button>
                )}
            </div>
        </div>
    );
};

export default LessonContent; 