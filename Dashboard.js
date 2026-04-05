import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <div className="navbar">
        <h2>Cardiac Risk Prediction System</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#666', fontWeight: '500' }}>Welcome, <strong>{user.username}</strong> ({user.role})</span>
          <button onClick={() => navigate('/analytics')} className="btn btn-info" style={{ padding: '8px 12px', fontSize: '13px' }}>Analytics</button>
          <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '0', padding: '8px 16px', fontSize: '14px' }}>Logout</button>
        </div>
      </div>

      <div className="card">
        <h3>Assessment Workflow</h3>
        <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>Follow the steps below to complete a comprehensive cardiac risk assessment:</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/clinical')}
            style={{ 
              padding: '20px',
              fontSize: '16px',
              textAlign: 'left',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              height: 'auto',
              lineHeight: '1.6'
            }}
          >
            <div style={{ fontSize: '12px', opacity: '0.9', marginBottom: '4px' }}>STEP 1</div>
            <div style={{ fontWeight: '600' }}>Clinical Data</div>
            <div style={{ fontSize: '13px', opacity: '0.85' }}>Age, BP, cholesterol, ECG</div>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate('/lifestyle')}
            style={{ 
              padding: '20px',
              fontSize: '16px',
              textAlign: 'left',
              borderRadius: '8px',
              backgroundColor: 'var(--secondary)',
              height: 'auto',
              lineHeight: '1.6'
            }}
          >
            <div style={{ fontSize: '12px', opacity: '0.9', marginBottom: '4px' }}>STEP 2</div>
            <div style={{ fontWeight: '600' }}>Lifestyle Factors</div>
            <div style={{ fontSize: '13px', opacity: '0.85' }}>Smoking, exercise, diet, sleep</div>
          </button>

          <button
            className="btn"
            onClick={() => navigate('/validate')}
            style={{ 
              padding: '20px',
              fontSize: '16px',
              textAlign: 'left',
              borderRadius: '8px',
              backgroundColor: 'var(--warning)',
              color: '#000',
              height: 'auto',
              lineHeight: '1.6'
            }}
          >
            <div style={{ fontSize: '12px', opacity: '0.9', marginBottom: '4px' }}>STEP 3</div>
            <div style={{ fontWeight: '600' }}>Validate Data</div>
            <div style={{ fontSize: '13px', opacity: '0.85' }}>Verify all data entered</div>
          </button>

          <button
            className="btn btn-danger"
            onClick={() => navigate('/prediction')}
            style={{ 
              padding: '20px',
              fontSize: '16px',
              textAlign: 'left',
              borderRadius: '8px',
              backgroundColor: 'var(--danger)',
              height: 'auto',
              lineHeight: '1.6'
            }}
          >
            <div style={{ fontSize: '12px', opacity: '0.9', marginBottom: '4px' }}>STEP 4</div>
            <div style={{ fontWeight: '600' }}>Get Prediction</div>
            <div style={{ fontSize: '13px', opacity: '0.85' }}>View results & insights</div>
          </button>
        </div>

        <div style={{ marginTop: '36px', padding: '24px', background: 'var(--light-bg)', borderRadius: 'var(--border-radius)', borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ color: 'var(--primary)', marginTop: '0', marginBottom: '16px' }}>System Features</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--text-dark)' }}>🔐 Secure Authentication</p>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Role-based access control for doctors and healthcare professionals</p>
            </div>
            <div>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--text-dark)' }}>📊 Data Collection</p>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Separate forms for clinical and lifestyle risk factors</p>
            </div>
            <div>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--text-dark)' }}>🤖 Smart Predictions</p>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Random Forest + Vision Transformer with 87% accuracy</p>
            </div>
            <div>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--text-dark)' }}>💡 Explainability</p>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>SHAP analysis with recommendations for risk reduction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;