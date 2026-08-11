import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5001/api";

function AdminRewards() {
  const { token } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get(`${API_BASE}/messages/claims`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClaims(res.data);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchClaims();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Reward Claims</h1>
      </div>

      <div className="admin-content">
        {claims.length === 0 ? (
          <p>No rewards claimed yet.</p>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Quiz</th>
                  <th>Status</th>
                  <th>Claim Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>
                      {claim.user_name}
                      <br />
                      <small>{claim.user_email}</small>
                    </td>
                    <td>{claim.quiz_title}</td>
                    <td>
                      <span className={`status-badge ${claim.status === 'CLAIMED' ? 'active' : 'pending'}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>
                      {claim.status === 'CLAIMED' && claim.claim_data ? (
                        <div style={{fontSize: '12px', textAlign: 'left', background: '#f5f5f5', padding: '5px', borderRadius: '4px'}}>
                          {Object.entries(typeof claim.claim_data === 'string' ? JSON.parse(claim.claim_data) : claim.claim_data).map(([key, value]) => (
                            <div key={key}><strong>{key}:</strong> {value}</div>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{new Date(claim.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRewards;
