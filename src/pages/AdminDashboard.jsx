import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);
    const [selectedAttempt, setSelectedAttempt] = useState(null);

    const [viewMode, setViewMode] = useState('details'); // 'details' or 'leaderboard'

    useEffect(() => {
        // Enforce auth
        if (localStorage.getItem('abhyasamAdminAuth') !== 'true') {
            navigate('/admin');
            return;
        }

        fetch('http://localhost:5000/api/attempts')
            .then(res => res.json())
            .then(data => setAttempts(data))
            .catch(err => console.error('Error fetching data:', err));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('abhyasamAdminAuth');
        navigate('/admin');
    };

    const clearAllData = () => {
        if (window.confirm("Are you sure you want to delete all quiz responses? This cannot be undone.")) {
            localStorage.removeItem('abhyasamCompletedAttempts');
            setAttempts([]);
            setSelectedAttempt(null);
        }
    };

    const deleteAttempt = (index) => {
        if (window.confirm("Are you sure you want to delete this specific response?")) {
            const updatedAttempts = [...attempts];
            updatedAttempts.splice(index, 1);
            localStorage.setItem('abhyasamCompletedAttempts', JSON.stringify(updatedAttempts));
            setAttempts(updatedAttempts);
            if (selectedAttempt && attempts[index] === selectedAttempt) {
                setSelectedAttempt(null);
            }
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
        ? (attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalAttempts).toFixed(1)
        : 0;
    const cheatingAttempts = attempts.filter(a => a.cheated).length;

    // Get top 5 participants for leaderboard
    const leaderboardData = [...attempts]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="quiz-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2>Admin Dashboard</h2>
                    <p style={{ margin: 0 }}>Overview of all quiz participation and results.</p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ width: 'auto' }}>
                    Logout
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="question-card" style={{ marginBottom: 0, textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{totalAttempts}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Total Participants</div>
                </div>
                <div className="question-card" style={{ marginBottom: 0, textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{averageScore}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Average Score</div>
                </div>
                <div className="question-card" style={{ marginBottom: 0, textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>{cheatingAttempts}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Tab Switch Flags</div>
                </div>
            </div>

            {/* Navigation Options */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setViewMode('details')}
                    className={`btn ${viewMode === 'details' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: 'auto', padding: '0.75rem 2rem' }}
                >
                    Details
                </button>
                <button
                    onClick={() => setViewMode('leaderboard')}
                    className={`btn ${viewMode === 'leaderboard' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: 'auto', padding: '0.75rem 2rem' }}
                >
                    Leaderboard
                </button>
            </div>

            <div className="question-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ margin: 0 }}>
                        {viewMode === 'details' ? 'Participant Results' : 'Top 5 Participants (Leaderboard)'}
                    </h3>
                    {totalAttempts > 0 && viewMode === 'details' && (
                        <button onClick={clearAllData} className="btn btn-danger" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            Clear All Data
                        </button>
                    )}
                </div>

                {totalAttempts === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No quiz attempts recorded yet.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                        {viewMode === 'leaderboard' ? 'Rank & Participant' : 'Participant'}
                                    </th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Contact</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Submitted At</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Score</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(viewMode === 'details' ? attempts : leaderboardData).map((attempt, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {viewMode === 'leaderboard' && (
                                                    <span style={{
                                                        background: idx === 0 ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                                                        color: idx === 0 ? 'white' : 'var(--text)',
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700
                                                    }}>
                                                        {idx + 1}
                                                    </span>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{attempt.name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{attempt.club || 'N/A'} - {attempt.position || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontSize: '0.875rem' }}>{attempt.whatsapp}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{attempt.gmail}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontSize: '0.875rem' }}>{formatDate(attempt.timestamp)}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                                            {attempt.score !== undefined ? `${attempt.score}/${attempt.total || 50}` : 'N/A'}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {attempt.cheated ? (
                                                <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>Flagged</span>
                                            ) : (
                                                <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>Clean</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setSelectedAttempt(attempt)}
                                                className="btn btn-secondary"
                                                style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            >
                                                View
                                            </button>
                                            {viewMode === 'details' && (
                                                <button
                                                    onClick={() => deleteAttempt(idx)}
                                                    className="btn btn-danger"
                                                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for viewing detailed responses */}
            {selectedAttempt && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--background)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                            <h2 style={{ margin: 0 }}>Detailed Responses: {selectedAttempt.name}</h2>
                            <button onClick={() => setSelectedAttempt(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text)' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                            <div><strong>Club:</strong> {selectedAttempt.club}</div>
                            <div><strong>WhatsApp:</strong> {selectedAttempt.whatsapp}</div>
                            <div><strong>Gmail:</strong> {selectedAttempt.gmail}</div>
                            <div><strong>Submitted At:</strong> {formatDate(selectedAttempt.timestamp)}</div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <strong>Score:</strong> {selectedAttempt.score}/{selectedAttempt.total || 50}
                                {selectedAttempt.cheated && <span style={{ color: 'var(--danger)', marginLeft: '0.5rem' }}>(Flagged)</span>}
                            </div>
                        </div>

                        {selectedAttempt.questions && selectedAttempt.questions.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3>Question Breakdown</h3>
                                {selectedAttempt.questions.map((q, idx) => {
                                    const userAnswerIndex = selectedAttempt.answers ? selectedAttempt.answers[q.id] : undefined;
                                    const isCorrect = userAnswerIndex === q.answer;
                                    const isUnanswered = userAnswerIndex === undefined;

                                    return (
                                        <div key={idx} style={{ padding: '1rem', border: `1px solid ${isCorrect ? 'var(--success)' : isUnanswered ? 'var(--border)' : 'var(--danger)'}`, borderRadius: '8px', background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : isUnanswered ? 'transparent' : 'rgba(239, 68, 68, 0.05)' }}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{idx + 1}. {q.text}</div>
                                            <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                <strong>User Answer:</strong> {isUnanswered ? 'Not Answered' : q.options[userAnswerIndex]}
                                                {isCorrect && ' ✅'}
                                                {!isCorrect && !isUnanswered && ' ❌'}
                                            </div>
                                            {!isCorrect && (
                                                <div style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
                                                    <strong>Correct Answer:</strong> {q.options[q.answer]}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Detailed question data was not collected for this attempt.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
