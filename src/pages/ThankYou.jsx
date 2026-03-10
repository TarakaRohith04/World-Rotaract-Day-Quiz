import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ThankYou() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const scoreState = location.state;

    useEffect(() => {
        // Optionally retrieve user details
        const storedUser = localStorage.getItem('abhyasamUser');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);

            // Log this attempt as completed so they cannot take it again
            const completedAttempts = JSON.parse(localStorage.getItem('abhyasamCompletedAttempts') || '[]');
            const hasAttempted = completedAttempts.some(attempt =>
                attempt.whatsapp === userData.whatsapp ||
                attempt.gmail.toLowerCase() === userData.gmail.toLowerCase()
            );

            if (!hasAttempted) {
                const attemptData = {
                    name: userData.name,
                    club: userData.club,
                    position: userData.position,
                    whatsapp: userData.whatsapp,
                    gmail: userData.gmail.toLowerCase(),
                    score: scoreState?.score || 0,
                    total: scoreState?.total || (scoreState?.questions?.length || 50),
                    cheated: scoreState?.cheated || false,
                    questions: scoreState?.questions || [],
                    answers: scoreState?.answers || {},
                    timestamp: new Date().toISOString()
                };

                // Save to local storage for backward compatibility
                completedAttempts.push(attemptData);
                localStorage.setItem('abhyasamCompletedAttempts', JSON.stringify(completedAttempts));

                // Push to backend
                fetch("https://world-rotaract-quiz-backend.onrender.com/api/attempts", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(attemptData)
                })
                    .then(res => res.json())
                    .then(data => console.log('Data saved to MongoDB:', data))
                    .catch(err => console.error('Error saving to MongoDB:', err));
            }
        }
    }, []);

    return (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>

            <h1 style={{ marginBottom: '0.5rem' }}>Thank You!</h1>
            {user && (
                <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 600 }}>
                    {user.name}
                </h2>
            )}

            {scoreState?.cheated ? (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    border: '1px solid var(--danger)'
                }}>
                    <p style={{ fontSize: '1.2rem', margin: 0, color: 'var(--danger)', fontWeight: 600 }}>
                        Thank you for attempting the quiz, you are over qualified to write this exam.
                    </p>
                </div>
            ) : (
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Your answers have been successfully submitted. We appreciate your participation in the
                    <strong> Project Abhyasam</strong> Quiz by the Rotaract Club of Vijayawada Elite League.
                </p>
            )}

            <button
                className="btn btn-secondary"
                onClick={() => {
                    localStorage.removeItem('abhyasamUser');
                    navigate('/');
                }}
                style={{ width: 'auto' }}
            >
                Return to Home
            </button>
        </div>
    );
}

export default ThankYou;
