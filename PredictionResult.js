import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Chart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function PredictionResult() {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPrediction();
  }, []);

  // Helper to create an SVG path for SHAP line plot
  const createLinePath = (values, width = 600, height = 140, padding = 10) => {
    if (!values || values.length === 0) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const step = (width - padding * 2) / (values.length - 1 || 1);
    const pts = values.map((v, i) => {
      const x = padding + i * step;
      const y = padding + (1 - (v - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    return 'M ' + pts.join(' L ');
  };

  const getShapBounds = (values) => {
    if (!values || values.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const getFeatureLabels = (explanation) => {
    return Object.keys(explanation.feature_importance || {});
  };

  const getShapValues = (explanation) => {
    // support both explicit shap_values or fallback to feature_importance
    if (explanation.shap_values && explanation.shap_values.length) return explanation.shap_values;
    const labels = getFeatureLabels(explanation);
    return labels.map(l => explanation.feature_importance[l] || 0);
  };

  const getPrediction = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('/api/predict/', {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPredictionData(response.data);
      setError('');
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Prediction failed. Please ensure all data has been submitted.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reference to the report container for PDF export
  const reportRef = useRef(null);

  const handleSaveReport = async () => {
    if (!reportRef.current) {
      alert('Nothing to save');
      return;
    }
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
      pdf.save(`Cardiac_Risk_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error('Save report failed', err);
      alert('Failed to save report. See console for details.');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="navbar">
          <h2>Prediction & Analysis</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
        </div>
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
            <span style={{ display: 'inline-block', marginRight: '8px' }}>⏳</span>
            Processing your cardiac risk assessment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="navbar">
          <h2>Prediction & Analysis</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
        </div>
        <div className="card">
          <div className="alert alert-danger">{error}</div>
          <button onClick={() => navigate('/validate')} className="btn btn-primary">
            Go Back to Validation
          </button>
        </div>
      </div>
    );
  }

  const { prediction, explanation, recommendations } = predictionData;
  const riskClassName = prediction.risk_class === 'high' ? 'risk-high' : 'risk-low';
  const riskLabel = prediction.risk_class === 'high' ? 'High Risk' : 'Low Risk';

  return (
    <div>
      <div className="navbar">
        <h2>Prediction & Analysis</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
      </div>

      <div className="prediction-card" ref={reportRef} style={{ marginBottom: '24px' }}>
        {/* Main Risk Assessment Card */}
        <div style={{ background: 'linear-gradient(135deg, var(--light-bg), white)', padding: '32px', borderRadius: 'var(--border-radius)', marginBottom: '24px', border: `3px solid ${prediction.risk_class === 'high' ? 'var(--danger)' : 'var(--success)'}` }}>
          <h3 style={{ margin: '0 0 24px 0', color: 'var(--text-dark)' }}>Cardiac Risk Assessment Result</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
            {/* Risk Classification */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Classification</div>
              <div className={`risk-score ${riskClassName}`} style={{ fontSize: '52px', fontWeight: 'bold', margin: '12px 0' }}>
                {riskLabel}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                {prediction.risk_class === 'high' ? '⚠️ Immediate attention required' : '✅ Low risk indicator'}
              </div>
            </div>

            {/* Risk Probability */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Probability</div>
              <div style={{ fontSize: '52px', fontWeight: 'bold', color: 'var(--primary)', margin: '12px 0' }}>
                {prediction.combined_probability ? `${prediction.combined_probability}%` : (prediction.risk_probability ? `${prediction.risk_probability}%` : `${prediction.tabular_probability}%`)}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Based on Random Forest + ViT Ensemble
              </div>
            </div>
          </div>
        </div>

        {/* Model Performance Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="insight-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Tabular Model</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
              {prediction.tabular_probability ?? prediction.risk_probability}%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Clinical + Lifestyle</div>
          </div>

          {prediction.image_probability !== undefined && (
            <div className="insight-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Image Model</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                {prediction.image_probability}%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>ECG Analysis</div>
            </div>
          )}

          <div className="insight-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Model Accuracy</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>
              {prediction.model_accuracy}%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Validation Score</div>
          </div>
        </div>

        {/* Advanced Insights Section */}
        <div className="advanced-insights-container">
          <h3 style={{ color: 'var(--primary)', marginBottom: '20px' }}>💡 Advanced Insights</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Confidence Score */}
            <div className="insight-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <h5 style={{ margin: '0 0 12px 0', color: 'var(--primary)', fontSize: '14px' }}>🎯 Model Confidence</h5>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
                {prediction.confidence_score !== undefined ? `${prediction.confidence_score}%` : 'N/A'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {prediction.confidence_score > 85 ? '✅ High confidence prediction' : prediction.confidence_score > 70 ? '⚠️ Moderate confidence' : '❓ Low confidence'}
              </div>
            </div>

            {/* Grouped SHAP Contribution */}
            {predictionData.advanced_insights?.grouped_contribution && (
              <div className="insight-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <h5 style={{ margin: '0 0 12px 0', color: 'var(--secondary)', fontSize: '14px' }}>📊 Risk Contributors</h5>
                <div style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.8' }}>
                  <div>📋 Clinical: <strong>{predictionData.advanced_insights.grouped_contribution.clinical_percent}%</strong></div>
                  <div>🏥 Lifestyle: <strong>{predictionData.advanced_insights.grouped_contribution.lifestyle_percent}%</strong></div>
                  <div>❤️ ECG: <strong>{predictionData.advanced_insights.grouped_contribution.ecg_percent}%</strong></div>
                </div>
              </div>
            )}
            {/* Biological Age */}
            {predictionData.advanced_insights?.biological_age !== undefined && (
              <div className="insight-card" style={{ borderLeft: '4px solid var(--info)' }}>
                <h5 style={{ margin: '0 0 12px 0', color: 'var(--info)', fontSize: '14px' }}>🧬 Biological Age</h5>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--info)', marginBottom: '8px' }}>
                  {predictionData.advanced_insights.biological_age} yrs
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Estimated cardiac biological age vs chronological age
                </div>
              </div>
            )}
          </div>

          {/* Preventable Risk */}
          {predictionData.advanced_insights?.preventable_risk_percent !== undefined && (
            <div className="insight-card success" style={{ marginBottom: '24px', padding: '20px' }}>
              <h5 style={{ margin: '0 0 12px 0', color: 'var(--success)', fontSize: '14px' }}>✨ Preventable Risk</h5>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--success)', marginBottom: '8px' }}>
                {predictionData.advanced_insights.preventable_risk_percent}%
              </div>
              <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)' }}>
                This percentage of your risk can be reduced through lifestyle modifications and medical interventions.
              </p>
            </div>
          )}

          {/* Counterfactual Suggestions */}
          {predictionData.advanced_insights?.counterfactuals && predictionData.advanced_insights.counterfactuals.length > 0 && (
            <div className="insight-card" style={{ marginBottom: '24px', padding: '16px', borderLeft: '4px solid var(--warning)' }}>
              <h5 style={{ margin: '0 0 12px 0', color: 'var(--warning)', fontSize: '14px' }}>🔁 Counterfactual Suggestions</h5>
              <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                <ol style={{ margin: '8px 0 0 18px' }}>
                  {predictionData.advanced_insights.counterfactuals.slice(0,5).map((cf, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{cf}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* What-If Simulator */}
          <div style={{ background: 'var(--light-bg)', padding: '24px', borderRadius: 'var(--border-radius)', marginBottom: '24px', border: '2px solid var(--primary)' }}>
            <h4 style={{ color: 'var(--primary)', margin: '0 0 16px 0' }}>🔮 What-If Simulator</h4>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 16px 0' }}>Modify lifestyle factors and see how your risk would change:</p>
            <WhatIfSimulator />
          </div>
        </div>

        {/* SHAP Explanation */}
        <div className="shap-chart" style={{ marginBottom: '24px' }}>
          <h4 style={{ color: 'var(--primary)', margin: '0 0 12px 0' }}>🔍 Feature Importance (SHAP Analysis)</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 16px 0' }}>These factors had the most impact on your risk prediction:</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
            {/* Top Factors List */}
            <div>
              <h5 style={{ color: 'var(--text-dark)', marginBottom: '12px', fontSize: '14px' }}>Top Risk Factors:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {explanation.top_factors.slice(0, 5).map((factor, index) => (
                  <div key={index} style={{ padding: '10px', background: 'white', borderRadius: '4px', borderLeft: `3px solid var(--primary)`, fontSize: '13px' }}>
                    <strong>{index + 1}. {factor}</strong><br/>
                    <span style={{ color: 'var(--text-muted)' }}>Impact: {explanation.feature_importance[factor]?.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ECG Area */}
            {(prediction.ecg_image_url || explanation.ecg_heatmap_url) && (
              <div>
                <h5 style={{ color: 'var(--text-dark)', marginBottom: '12px', fontSize: '14px' }}>ECG Analysis:</h5>
                <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                  {prediction.ecg_image_url && (
                    <div style={{ textAlign: 'center' }}>
                      <img src={prediction.ecg_image_url} alt="Uploaded ECG" style={{ maxWidth: '100%', maxHeight: '160px', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Uploaded ECG</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          {explanation && (
            (() => {
              const shapValues = getShapValues(explanation);
              if (!shapValues || shapValues.length === 0) return <p style={{ color: 'var(--text-muted)' }}>No SHAP data available.</p>;
              const labels = getFeatureLabels(explanation);
              const data = {
                labels,
                datasets: [
                  {
                    label: 'Feature Importance',
                    data: shapValues,
                    fill: false,
                    borderColor: 'var(--primary)',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    tension: 0.3,
                    pointRadius: 5,
                    pointBackgroundColor: 'var(--primary)',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2
                  }
                ]
              };
              const options = {
                responsive: true,
                plugins: {
                  tooltip: { mode: 'index', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                  legend: { display: true, position: 'bottom' }
                },
                scales: {
                  x: { display: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                  y: { display: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } }
                }
              };
              return (
                <div style={{ maxWidth: '100%', marginBottom: '16px' }}>
                  <Line data={data} options={options} />
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                    Analyzed {labels.length} features from your clinical and lifestyle data
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* Recommendations */}
        <div className="recommendations" style={{ marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 16px 0', color: 'var(--success)', fontSize: '16px' }}>📋 Personalized Recommendations</h4>
          <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
            {recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', color: 'var(--text-dark)', lineHeight: '1.6', fontSize: '14px' }}>
                <span style={{ position: 'absolute', left: '0', color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-success"
            onClick={handleSaveReport}
          >
            📄 Save Report (PDF)
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default PredictionResult;

// Small local component for the What-If Simulator (front-end add-on)
function WhatIfSimulator() {
  const [form, setForm] = useState({
    smoking_status: '',
    alcohol_consumption: '',
    physical_activity: '',
    diet_pattern: '',
    stress_level: '',
    sleep_duration: ''
  });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/predict/simulate-risk', { modified_lifestyle: form }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      console.error('Simulation error', err);
      alert('Simulation failed. See console.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <select name="smoking_status" value={form.smoking_status} onChange={onChange} className="form-control" style={{ fontSize: '13px', padding: '8px' }}>
          <option value="">Smoking</option>
          <option value="never">Never</option>
          <option value="former">Former</option>
          <option value="current">Current</option>
        </select>
        <select name="alcohol_consumption" value={form.alcohol_consumption} onChange={onChange} className="form-control" style={{ fontSize: '13px', padding: '8px' }}>
          <option value="">Alcohol</option>
          <option value="none">None</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <select name="physical_activity" value={form.physical_activity} onChange={onChange} className="form-control" style={{ fontSize: '13px', padding: '8px' }}>
          <option value="">Activity</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <select name="diet_pattern" value={form.diet_pattern} onChange={onChange} className="form-control" style={{ fontSize: '13px', padding: '8px' }}>
          <option value="">Diet</option>
          <option value="healthy">Healthy</option>
          <option value="unhealthy">Unhealthy</option>
        </select>
        <select name="stress_level" value={form.stress_level} onChange={onChange} className="form-control" style={{ fontSize: '13px', padding: '8px' }}>
          <option value="">Stress</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <input name="sleep_duration" type="number" placeholder="Sleep (hrs)" value={form.sleep_duration} onChange={onChange} className="form-control" style={{ fontSize: '13px', padding: '8px' }} />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <button onClick={submit} disabled={busy} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
          {busy ? '⏳ Simulating...' : '🔮 Run Simulation'}
        </button>
      </div>

      {result && (
        <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--border-radius)', border: '2px solid var(--primary)', marginTop: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>Previous Risk</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)' }}>{result.previous_risk}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>New Risk</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>{result.new_risk}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>Difference</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: result.risk_difference > 0 ? 'var(--danger)' : 'var(--success)' }}>
                {result.risk_difference > 0 ? '+' : ''}{result.risk_difference}%
              </div>
            </div>
          </div>
          <div style={{ padding: '12px', background: 'var(--light-bg)', borderRadius: '4px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
            {result.risk_difference < 0 ? '✅ Your modifications would reduce risk' : result.risk_difference > 0 ? '⚠️ These changes would increase risk' : '➡️ No change in risk'}
          </div>
        </div>
      )}
    </div>
  );
}