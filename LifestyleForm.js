import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LifestyleForm() {
  const [formData, setFormData] = useState({
    smoking_status: '',
    alcohol_consumption: '',
    physical_activity: '',
    diet_pattern: '',
    stress_level: '',
    sleep_duration: '',
    family_history: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.smoking_status || !formData.alcohol_consumption || 
        !formData.physical_activity || !formData.diet_pattern || 
        !formData.stress_level || formData.sleep_duration === '') {
      setError('All fields are required!');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        smoking_status: formData.smoking_status,
        alcohol_consumption: formData.alcohol_consumption,
        physical_activity: formData.physical_activity,
        diet_pattern: formData.diet_pattern,
        stress_level: formData.stress_level,
        sleep_duration: parseFloat(formData.sleep_duration),
        family_history: formData.family_history
      };
      
      const response = await axios.post('/api/data/lifestyle', submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess('Lifestyle data submitted successfully!');
      setError('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.response?.data?.error || error.message || 'Submission failed');
      setSuccess('');
    }
  };

  return (
    <div>
      <div className="navbar">
        <h2>Lifestyle Data Form</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="card form-container">
        <h3>Enter Lifestyle Information</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Smoking Status:</label>
              <select
                name="smoking_status"
                className="form-control"
                value={formData.smoking_status}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="never">Never</option>
                <option value="former">Former</option>
                <option value="current">Current</option>
              </select>
            </div>
            <div className="form-group">
              <label>Alcohol Consumption:</label>
              <select
                name="alcohol_consumption"
                className="form-control"
                value={formData.alcohol_consumption}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Physical Activity Level:</label>
              <select
                name="physical_activity"
                className="form-control"
                value={formData.physical_activity}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Diet Pattern:</label>
              <select
                name="diet_pattern"
                className="form-control"
                value={formData.diet_pattern}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="healthy">Healthy</option>
                <option value="unhealthy">Unhealthy</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stress Level:</label>
              <select
                name="stress_level"
                className="form-control"
                value={formData.stress_level}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sleep Duration (hours):</label>
              <input
                type="number"
                name="sleep_duration"
                className="form-control"
                value={formData.sleep_duration}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="24"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="family_history"
                checked={formData.family_history}
                onChange={handleChange}
              />
              Family History of Heart Disease
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary">Submit Lifestyle Data</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LifestyleForm;