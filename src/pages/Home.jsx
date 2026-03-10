import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="glass-panel">
            <h1>Welcome to Project Abhyasam</h1>
            <h2>A Quiz Competition Platform</h2>

            <p>
                Project Abhyasam is an initiative by the <strong>Rotaract Club of Vijayawada Elite League</strong>.
                This platform is designed to conduct engaging and competitive quizzes for Rotaractors.
            </p>

            <p>
                Challenge your knowledge, compete with peers, and learn new things across various domains.
                The quiz consists of multiple-choice questions with a 60-minute time limit. Make sure you
                have a stable internet connection before starting.
            </p>

            <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/register')}
                    style={{ fontSize: '1.2rem', padding: '1rem 2rem', maxWidth: '300px' }}
                >
                    Start the Quiz
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin')}
                    style={{ fontSize: '1rem', padding: '0.75rem 2rem', maxWidth: '300px' }}
                >
                    Admin Portal
                </button>
            </div>
        </div>
    );
}

export default Home;
