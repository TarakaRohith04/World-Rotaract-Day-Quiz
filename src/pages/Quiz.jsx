import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { questions as sourceQuestions } from '../data/questions';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const QUESTIONS_PER_PAGE = 10;

// Randomize questions within their sections (every 10 questions)
const randomizeBySection = (questionsArray, sectionSize) => {
    const randomized = [];
    for (let i = 0; i < questionsArray.length; i += sectionSize) {
        const chunk = questionsArray.slice(i, i + sectionSize).map(q => {
            // Create a deeply-copied question object to avoid mutating the original source
            const originalCorrectOption = q.options[q.answer];
            const shuffledOptions = shuffleArray([...q.options]);
            const newAnswerIndex = shuffledOptions.indexOf(originalCorrectOption);

            return {
                ...q,
                options: shuffledOptions,
                answer: newAnswerIndex
            };
        });
        randomized.push(...shuffleArray(chunk));
    }
    return randomized;
};

const QUIZ_DURATION_MINUTES = 60;

function Quiz() {
    const navigate = useNavigate();
    // Randomize questions only within each section of 10
    const [questions] = useState(() => randomizeBySection(sourceQuestions, QUESTIONS_PER_PAGE));
    const TOTAL_PAGES = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_MINUTES * 60);

    useEffect(() => {
        // Timer Logic
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Anti-cheating: Tab visibility detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User switched tabs, auto submit immediately
                clearInterval(timer);
                handleSubmit(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [answers]); // Added answers to dependency array to capture latest state on auto-submit

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentPage < TOTAL_PAGES) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (isCheating = false) => {

    let score = 0;

    questions.forEach(q => {
        if (answers[q.id] === q.answer) {
            score += 1;
        }
    });

    const user = JSON.parse(localStorage.getItem("abhyasamUser"));

    const payload = {
        name: user.name,
        club: user.club,
        position: user.position,
        whatsapp: user.whatsapp,
        gmail: user.gmail,
        score: score,
        total: questions.length,
        cheated: isCheating,
        questions: questions,
        answers: answers
    };

    try {

        await fetch(
            "https://world-rotaract-day-quiz.onrender.com/api/attempts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

    } catch (error) {
        console.error("Error saving attempt:", error);
    }

    navigate('/thank-you', {
        state: {
            score: score,
            total: questions.length,
            cheated: isCheating,
            questions: questions,
            answers: answers
        }
    });
};
    // Get current page questions
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

    // Timer visual state mapping
    const timerClass = timeLeft < 300 ? 'timer-critical' : (timeLeft < 900 ? 'timer-warning' : 'timer-running');

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <div className="quiz-header">
                <h2>Abhyasam Quiz</h2>
                <div className={`timer-container ${timerClass}`}>
                    ⏱ {formatTime(timeLeft)}
                </div>
            </div>

            <div className="questions-container">
                {currentQuestions.map((q, index) => (
                    <div key={q.id} className="question-card">
                        <h3 className="question-text">
                            {startIndex + index + 1}. {q.text}
                        </h3>
                        <div className="options-grid">
                            {q.options.map((opt, optIndex) => (
                                <label
                                    key={optIndex}
                                    className={`option-label ${answers[q.id] === optIndex ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={optIndex}
                                        checked={answers[q.id] === optIndex}
                                        onChange={() => handleOptionSelect(q.id, optIndex)}
                                        className="option-input"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="quiz-footer">
                <span className="page-indicator">
                    Page {currentPage} of {TOTAL_PAGES}
                </span>

                <div>
                    {currentPage < TOTAL_PAGES ? (
                        <button className="btn btn-primary" onClick={handleNext} style={{ width: 'auto', minWidth: '120px' }}>
                            Next Page
                        </button>
                    ) : (
                        <button className="btn btn-danger" onClick={() => handleSubmit(false)} style={{ width: 'auto', minWidth: '120px' }}>
                            Submit Quiz
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Quiz;
