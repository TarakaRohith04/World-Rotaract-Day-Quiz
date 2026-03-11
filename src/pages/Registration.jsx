import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        club: '',
        position: '',
        whatsapp: '',
        gmail: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const completedAttempts = JSON.parse(
            localStorage.getItem('abhyasamCompletedAttempts') || '[]'
        );

        const hasAttempted = completedAttempts.some(attempt =>
            attempt.whatsapp === formData.whatsapp ||
            attempt.gmail.toLowerCase() === formData.gmail.toLowerCase()
        );

        if (hasAttempted) {
            alert("You have already attempted this quiz. Only one attempt is allowed per user.");
            return;
        }

        try {
            // 🔹 STORE USER LOCALLY FOR QUIZ FLOW
            localStorage.setItem('abhyasamUser', JSON.stringify(formData));

            // 🔹 MOVE TO QUIZ
            navigate('/quiz');

        } catch (error) {
            console.error("Registration Error:", error);
            alert("Failed to register. Please try again.");
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '500px' }}>
            <h2>Participant Details</h2>

            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Please fill out this form to start the quiz.
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label className="form-label">Name of the Rotaractor</label>

                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Rtr. Gurram Taraka Rohith"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Name of the Club</label>

                    <input
                        type="text"
                        name="club"
                        className="form-input"
                        value={formData.club}
                        onChange={handleChange}
                        required
                        placeholder="RAC Vijayawada Elite League"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Position / Designation</label>

                    <input
                        type="text"
                        name="position"
                        className="form-input"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        placeholder="Member"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">WhatsApp Number</label>

                    <input
                        type="tel"
                        name="whatsapp"
                        className="form-input"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                        placeholder="+91 xxxxx xxxxx"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Gmail</label>

                    <input
                        type="email"
                        name="gmail"
                        className="form-input"
                        value={formData.gmail}
                        onChange={handleChange}
                        required
                        placeholder="tarakarohith@gmail.com"
                    />
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <button type="submit" className="btn btn-primary">
                        Enter Quiz
                    </button>
                </div>

            </form>
        </div>
    );
}

export default Registration;
