const fs = require('fs');
const file = 'client/src/pages/Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

const profileAdditions = `
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('quizzes'); // quizzes or messages
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [claimForm, setClaimForm] = useState({});
  const [submittingClaim, setSubmittingClaim] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (token) {
          const res = await axios.get(\`\${API_BASE}/messages/my-messages\`, {
            headers: { Authorization: \`Bearer \${token}\` }
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
      await axios.post(\`\${API_BASE}/messages/\${selectedMessage.id}/submit-claim\`, {
        claim_data: claimForm
      }, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      alert('Reward claim submitted successfully!');
      setSelectedMessage(null);
      
      // Refresh messages
      const res = await axios.get(\`\${API_BASE}/messages/my-messages\`, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to submit claim:', err);
      alert('Failed to submit claim. Please try again.');
    } finally {
      setSubmittingClaim(false);
    }
  };
`;

content = content.replace('  const totalQuizzes = attempts.length;', profileAdditions + '\n  const totalQuizzes = attempts.length;');

const renderAdditions = `
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
                  <Link to={\`/attempt/\${attempt.quiz_id}/\${attempt.id}\`} key={attempt.id} className="profile-quiz-card-link" style={{textDecoration: 'none', color: 'inherit'}}>
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
                  <div key={msg.id} className="profile-quiz-card" style={{cursor: 'pointer', border: msg.status === 'UNREAD' ? '2px solid #006b3c' : '1px solid #ddd'}} onClick={() => {
                    if (msg.type === 'REWARD_CLAIM' && msg.status !== 'CLAIMED') {
                      setSelectedMessage(msg);
                      const initialForm = {};
                      const fields = msg.form_fields ? (typeof msg.form_fields === 'string' ? JSON.parse(msg.form_fields) : msg.form_fields) : ["Full Name", "Phone Number", "Shipping Address"];
                      fields.forEach(f => initialForm[f] = "");
                      setClaimForm(initialForm);
                    }
                  }}>
                    <h4 style={{display: 'flex', justifyContent: 'space-between'}}>
                      {msg.title}
                      {msg.status === 'UNREAD' && <span style={{color: 'red', fontSize: '12px', fontWeight: 'bold'}}>NEW</span>}
                      {msg.status === 'CLAIMED' && <span style={{color: 'green', fontSize: '12px', fontWeight: 'bold'}}>CLAIMED</span>}
                    </h4>
                    <p style={{fontSize: '14px', color: '#555', marginTop: '10px'}}>{msg.content}</p>
                    <div className="quiz-date" style={{marginTop: '15px'}}>
                      Received: {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                    {msg.type === 'REWARD_CLAIM' && msg.status !== 'CLAIMED' && (
                      <button style={{marginTop: '15px', background: '#006b3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', width: '100%', cursor: 'pointer'}}>
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
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
            <div style={{background: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px'}}>
              <h2>Claim Your Reward</h2>
              <p style={{marginBottom: '20px', color: '#555'}}>Please provide the following information to claim your reward for: <strong>{selectedMessage.title}</strong></p>
              
              <form onSubmit={handleClaimSubmit}>
                {Object.keys(claimForm).map((field) => (
                  <div key={field} style={{marginBottom: '15px'}}>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>{field}</label>
                    <input 
                      type="text" 
                      required 
                      value={claimForm[field]} 
                      onChange={(e) => setClaimForm({...claimForm, [field]: e.target.value})}
                      style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
                    />
                  </div>
                ))}
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                  <button type="button" onClick={() => setSelectedMessage(null)} style={{padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer'}}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingClaim} style={{padding: '10px 20px', border: 'none', borderRadius: '4px', background: '#006b3c', color: 'white', cursor: 'pointer'}}>
                    {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
`;

const startIdx = content.indexOf('        {/* Participated Quizzes */}');
const endIdx = content.indexOf('      </div>\n    </div>\n  );\n}');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + renderAdditions + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Profile.jsx updated successfully');
}
