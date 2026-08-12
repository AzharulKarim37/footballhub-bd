import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const API_BASE = "http://localhost:5001/api";

function Profile() {
  const { user, token } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (token) {
          const res = await axios.get(`${API_BASE}/quizzes/my-attempts`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAttempts(res.data.attempts || []);
        }
      } catch (err) {
        console.error("Failed to fetch user attempts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [token]);

  // Calculate some stats

  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('quizzes'); // quizzes or messages
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [claimForm, setClaimForm] = useState({});
  const [submittingClaim, setSubmittingClaim] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (token) {
          const res = await axios.get(`${API_BASE}/messages/my-messages`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [token, activeTab]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;
    
    setSubmittingClaim(true);
    try {
      await axios.post(`${API_BASE}/messages/${selectedMessage.id}/submit-claim`, {
        claim_data: claimForm
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Reward claim submitted successfully!');
      setSelectedMessage(null);
      
      // Refresh messages
      const res = await axios.get(`${API_BASE}/messages/my-messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to submit claim:', err);
      alert('Failed to submit claim. Please try again.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const totalQuizzes = attempts.length;
  const totalQuestions = attempts.reduce((acc, curr) => acc + curr.total_questions, 0);
  const totalCorrect = attempts.reduce((acc, curr) => acc + curr.score, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  // Something more: A user level based on correct answers
  let level = "Rookie";
  if (totalCorrect >= 50) level = "Legend";
  else if (totalCorrect >= 25) level = "Pro";
  else if (totalCorrect >= 10) level = "Amateur";

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* User Info Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-info">
            <h1>{user?.name || "User"}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-level-badge">🏆 {level} Level</span>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="profile-stats">
          <div className="stat-card">
            <h3>Total Quizzes</h3>
            <p>{totalQuizzes}</p>
          </div>
          <div className="stat-card">
            <h3>Total Correct</h3>
            <p>{totalCorrect}</p>
          </div>
          <div className="stat-card">
            <h3>Accuracy</h3>
            <p>{accuracy}%</p>
          </div>
        </div>


        {/* Profile Navigation */}
        <div style={{display: 'flex', gap: '20px', borderBottom: '1px solid #eee', marginBottom: '20px'}}>
          <button 
            style={{background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer', borderBottom: activeTab === 'quizzes' ? '3px solid #006b3c' : 'none', fontWeight: activeTab === 'quizzes' ? 'bold' : 'normal', color: activeTab === 'quizzes' ? '#006b3c' : '#666'}}
            onClick={() => setActiveTab('quizzes')}
          >
            Recent Attempts
          </button>
          <button 
            style={{background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer', borderBottom: activeTab === 'messages' ? '3px solid #006b3c' : 'none', fontWeight: activeTab === 'messages' ? 'bold' : 'normal', color: activeTab === 'messages' ? '#006b3c' : '#666', display: 'flex', alignItems: 'center', gap: '8px'}}
            onClick={() => setActiveTab('messages')}
          >
            Inbox & Rewards
            {messages.filter(m => m.status === 'UNREAD').length > 0 && (
              <span style={{background: 'red', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '12px'}}>
                {messages.filter(m => m.status === 'UNREAD').length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'quizzes' && (
          <div className="profile-quizzes-section">
            <h2>Your Recent Quiz Attempts</h2>
            {attempts.length === 0 ? (
              <div className="no-quizzes">
                <p>You haven't participated in any quizzes yet.</p>
                <Link to="/quiz" className="btn-primary">Explore Quizzes</Link>
              </div>
            ) : (
              <div className="profile-quizzes-grid">
                {attempts.map((attempt) => (
                  <Link to={`/attempt/${attempt.quiz_id}/${attempt.id}`} key={attempt.id} className="profile-quiz-card-link" style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="profile-quiz-card">
                      <h4>{attempt.title}</h4>
                      <p className="quiz-meta">Difficulty: {attempt.difficulty}</p>
                      {attempt.leaderboard_published === 1 && (
                        <p className="quiz-meta" style={{color: '#176b43', fontWeight: 'bold'}}>
                          Leaderboard Rank: #{attempt.user_rank}
                        </p>
                      )}
                      <div className="quiz-score-box">
                        Score: <strong>{attempt.score}/{attempt.total_questions}</strong>
                      </div>
                      <div className="quiz-date">
                        Completed: {new Date(attempt.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="profile-messages-section">
            <h2>Inbox & Rewards</h2>
            {messages.length === 0 ? (
              <div className="no-quizzes">
                <p>No messages yet.</p>
              </div>
            ) : (
              <div className="profile-quizzes-grid">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`profile-quiz-card message-card ${msg.status === 'UNREAD' ? 'unread' : ''}`}
                    onClick={() => {
                      if (msg.type === 'REWARD_CLAIM' && msg.status !== 'CLAIMED') {
                        setSelectedMessage(msg);
                        const initialForm = {};
                        const fields = msg.form_fields ? (typeof msg.form_fields === 'string' ? JSON.parse(msg.form_fields) : msg.form_fields) : ["Full Name", "Phone Number", "Shipping Address"];
                        fields.forEach(f => initialForm[f] = "");
                        setClaimForm(initialForm);
                      }
                    }}
                  >
                    <h4 className="message-title">
                      {msg.title}
                      {msg.status === 'UNREAD' && <span className="badge new">NEW</span>}
                      {msg.status === 'CLAIMED' && <span className="badge claimed">CLAIMED</span>}
                    </h4>
                    <p className="message-content">{msg.content}</p>
                    <div className="quiz-date message-date">
                      Received: {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                    {msg.type === 'REWARD_CLAIM' && msg.status !== 'CLAIMED' && (
                      <button className="btn-claim-reward">
                        Claim Reward
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Claim Modal */}
        {selectedMessage && (
          <div className="modal-overlay">
            <div className="claim-modal-content">
              <h2>Claim Your Reward</h2>
              <p className="claim-modal-desc">
                Please provide the following information to claim your reward for: <strong>{selectedMessage.title}</strong>
              </p>
              
              <form onSubmit={handleClaimSubmit} className="claim-form">
                {Object.keys(claimForm).map((field) => (
                  <div key={field} className="claim-form-group">
                    <label>{field}</label>
                    <input 
                      type="text" 
                      required 
                      value={claimForm[field]} 
                      onChange={(e) => setClaimForm({...claimForm, [field]: e.target.value})}
                    />
                  </div>
                ))}
                
                <div className="claim-modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setSelectedMessage(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={submittingClaim}>
                    {submittingClaim ? "Submitting..." : "Submit Claim"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
