const fs = require('fs');
const file = 'client/src/pages/AdminQuizzes.jsx';
let content = fs.readFileSync(file, 'utf8');

const modalJsx = `
                {/* ==========================================
                    REWARDS CONFIG MODAL
                ========================================== */}
                {showRewardsModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h2>Configure Reward Fields</h2>
                      <p>Define the fields the winners must fill out to claim their reward:</p>
                      
                      <div style={{marginTop: '20px', marginBottom: '20px'}}>
                        {rewardFields.map((field, index) => (
                          <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                            <input
                              type="text"
                              value={field}
                              onChange={(e) => {
                                const newFields = [...rewardFields];
                                newFields[index] = e.target.value;
                                setRewardFields(newFields);
                              }}
                              style={{flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                            />
                            <button type="button" onClick={() => {
                              const newFields = rewardFields.filter((_, i) => i !== index);
                              setRewardFields(newFields);
                            }} style={{background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '0 10px', cursor: 'pointer'}}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => setRewardFields([...rewardFields, ""])} style={{background: '#006b3c', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 15px', cursor: 'pointer'}}>
                          + Add Field
                        </button>
                      </div>

                      <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setShowRewardsModal(false)}>
                          Cancel
                        </button>
                        <button className="btn-primary" onClick={submitSendRewards} disabled={sendingRewards}>
                          {sendingRewards ? "Sending..." : "Send Rewards"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
`;

content = content.replace('                {/* ==========================================\n                    LEADERBOARD', modalJsx + '\n                {/* ==========================================\n                    LEADERBOARD');
fs.writeFileSync(file, content);
console.log('Inserted rewards modal');
