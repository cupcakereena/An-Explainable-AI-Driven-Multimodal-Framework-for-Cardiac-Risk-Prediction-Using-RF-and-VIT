import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClinicalForm() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    blood_pressure: '',
    cholesterol: '',
    fasting_blood_sugar: '',
    ecg_results: '',
    max_heart_rate: '',
    chest_pain_type: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ecgFile, setEcgFile] = useState(null);
  const [ecgPreview, setEcgPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEcgFile(file);
      const previewUrl = URL.createObjectURL(file);
      setEcgPreview(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (ecgPreview) {
        URL.revokeObjectURL(ecgPreview);
      }
    };
  }, [ecgPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.age || !formData.sex || !formData.blood_pressure || 
        !formData.cholesterol || !formData.fasting_blood_sugar || 
        !formData.ecg_results || !formData.max_heart_rate || !formData.chest_pain_type) {
      setError('All fields are required!');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');

      // If file provided, use multipart/form-data
      if (ecgFile) {
        const form = new FormData();
        form.append('age', parseInt(formData.age));
        form.append('sex', formData.sex);
        form.append('blood_pressure', parseFloat(formData.blood_pressure));
        form.append('cholesterol', parseFloat(formData.cholesterol));
        form.append('fasting_blood_sugar', parseFloat(formData.fasting_blood_sugar));
        form.append('ecg_results', formData.ecg_results);
        form.append('max_heart_rate', parseInt(formData.max_heart_rate));
        form.append('chest_pain_type', formData.chest_pain_type);
        form.append('ecg_image', ecgFile, ecgFile.name);

        const response = await axios.post('/api/data/clinical', form, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setSuccess('Clinical data and ECG image submitted successfully!');
      } else {
        const submitData = {
          age: parseInt(formData.age),
          sex: formData.sex,
          blood_pressure: parseFloat(formData.blood_pressure),
          cholesterol: parseFloat(formData.cholesterol),
          fasting_blood_sugar: parseFloat(formData.fasting_blood_sugar),
          ecg_results: formData.ecg_results,
          max_heart_rate: parseInt(formData.max_heart_rate),
          chest_pain_type: formData.chest_pain_type
        };
        
        const response = await axios.post('/api/data/clinical', submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('Clinical data submitted successfully!');
      }

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
        <h2>Clinical Data Form</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="card form-container">
        <h3>Enter Clinical Information</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
            </div>
            <div className="form-group">
              <label>Sex:</label>
              <select
                name="sex"
                className="form-control"
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Blood Pressure (mmHg):</label>
              <input
                type="number"
                name="blood_pressure"
                className="form-control"
                value={formData.blood_pressure}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
            <div className="form-group">
              <label>Cholesterol (mg/dL):</label>
              <input
                type="number"
                name="cholesterol"
                className="form-control"
                value={formData.cholesterol}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fasting Blood Sugar (mg/dL):</label>
              <input
                type="number"
                name="fasting_blood_sugar"
                className="form-control"
                value={formData.fasting_blood_sugar}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
            <div className="form-group">
              <label>ECG Results:</label>
              <select
                name="ecg_results"
                className="form-control"
                value={formData.ecg_results}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="normal">Normal</option>
                <option value="st-t_abnormality">ST-T Abnormality</option>
                <option value="lv_hypertrophy">Left Ventricular Hypertrophy</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Maximum Heart Rate:</label>
              <input
                type="number"
                name="max_heart_rate"
                className="form-control"
                value={formData.max_heart_rate}
                onChange={handleChange}
                min="60"
                max="220"
                required
              />
            </div>
            <div className="form-group">
              <label>Chest Pain Type:</label>
              <select
                name="chest_pain_type"
                className="form-control"
                value={formData.chest_pain_type}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="typical_angina">Typical Angina</option>
                <option value="atypical_angina">Atypical Angina</option>
                <option value="non_anginal_pain">Non-Anginal Pain</option>
                <option value="asymptomatic">Asymptomatic</option>
              </select>
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Upload ECG Image (optional):</label>
              <input
                type="file"
                accept="image/*"
                name="ecg_image"
                className="form-control"
                onChange={handleFileChange}
              />
              {ecgPreview && (
                <div style={{ marginTop: '12px' }}>
                  <strong style={{ color: '#666', fontSize: '14px' }}>Preview:</strong>
                  <div style={{ marginTop: '8px' }}>
                    <img src={ecgPreview} alt="ECG preview" style={{ maxWidth: '100%', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary">Submit Clinical Data</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClinicalForm;