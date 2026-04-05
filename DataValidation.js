import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DataValidation() {
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkDataValidation();
  }, []);

  const checkDataValidation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/data/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setValidationResult(response.data);
    } catch (error) {
      setValidationResult({ valid: false, message: 'Error checking data validation' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="navbar">
          <h2>Data Validation</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
        </div>
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
            <span style={{ display: 'inline-block', marginRight: '8px' }}>⏳</span>
            Validating your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar">
        <h2>Data Validation</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
      </div>

      <div className="card">
        <h3>Data Validation Result</h3>

        {validationResult.valid ? (
          <div className="alert alert-success">
            <span style={{ fontSize: '20px', marginRight: '8px' }}>✅</span>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--success)' }}>Validation Successful</h4>
              <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)' }}>{validationResult.message}</p>
              <button
                className="btn btn-success"
                onClick={() => navigate('/prediction')}
              >
                Proceed to Prediction & Analysis
              </button>
            </div>
          </div>
        ) : (
          <div className="alert alert-danger">
            <span style={{ fontSize: '20px', marginRight: '8px' }}>❌</span>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--danger)' }}>Validation Failed</h4>
              <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)' }}>{validationResult.message}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/clinical')}
                >
                  Enter Clinical Data
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/lifestyle')}
                >
                  Enter Lifestyle Data
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '32px', padding: '24px', background: 'var(--light-bg)', borderRadius: 'var(--border-radius)', borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ color: 'var(--primary)', margin: '0 0 16px 0', fontSize: '16px' }}>Data Integration Process</h4>
          <ol style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <li>Clinical data includes: Age, Sex, Blood Pressure, Cholesterol, ECG, Heart Rate, Chest Pain Type</li>
            <li>Lifestyle data includes: Smoking Status, Alcohol Consumption, Physical Activity, Diet Pattern, Stress Level, Sleep Duration, Family History</li>
            <li>Both datasets are merged into a single feature vector for prediction</li>
            <li>Data validation ensures all required fields are present and properly formatted</li>
            <li>Validated data is fed into the advanced Random Forest + ViT ensemble model</li>
            <li>Results include risk probability, confidence scores, and personalized recommendations</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default DataValidation;