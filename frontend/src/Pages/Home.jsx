import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { refresh } from "../reducer/Actions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Home.css';

const CourseCard = ({ course, navigate }) => (
    <div className="card h-1 course-card">
        <div className="card-body d-flex flex-column">
            <h5 className="card-title">{course.title}</h5>
            <p className="card-text flex-grow-1">{course.description}</p>
            <p className="difficulty">
                Difficulty: {(() => {
                    switch(course?.difficulty_level) {
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
                    onClick={() => navigate(`/course/${course.id}`)}
                >
                    View Course
                </button>
            </div>
        </div>
    </div>
);

const Home = ({ refresh }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/courses/');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const difficultyMap = {
        1: 'Beginner',
        2: 'Intermediate',
        3: 'Advanced',
        4: 'Professional'
    };

    const filteredCourses = selectedDifficulty === 'all'
        ? courses
        : courses.filter(course => difficultyMap[course.difficulty_level] === selectedDifficulty);

    return (
        <div className="courses-container">
            <div className="difficulty-filters">
                <button
                    className={`difficulty-tag ${selectedDifficulty === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty('all')}
                >
                    All
                </button>
                {Object.keys(difficultyMap).map(level => (
                    <button
                        key={level}
                        className={`difficulty-tag ${selectedDifficulty === difficultyMap[level] ? 'active' : ''}`}
                        onClick={() => setSelectedDifficulty(difficultyMap[level])}
                    >
                        {difficultyMap[level]}
                    </button>
                ))}
            </div>

            <div className="courses-content">
                <div className="row g-3">
                    {filteredCourses.map((course) => (
                        <div key={course.id}>
                            <CourseCard course={course} navigate={navigate} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default connect(null, { refresh })(Home);