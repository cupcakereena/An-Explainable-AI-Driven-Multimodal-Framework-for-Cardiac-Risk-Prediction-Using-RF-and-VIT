import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/analytics/dashboard-analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
        setError('');
      } catch (err) {
        console.error('Analytics fetch error', err);
        const errorMsg = err.response?.data?.msg || 'Failed to load analytics data.';
        setError(errorMsg);
      }
    };
    fetchAnalytics();
  }, []);

  if (error) {
    return (
      <div>
        <div className="navbar">
          <h2>Analytics Dashboard</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
        </div>
        <div className="card">
          <div className="alert alert-danger">{error}</div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <div className="navbar">
          <h2>Analytics Dashboard</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
        </div>
        <div className="card">
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
            <span style={{ display: 'inline-block', marginRight: '8px' }}>⏳</span>
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  const dist = data.distribution || {};
  const distLabels = dist.bins || ['Low Risk', 'Medium Risk', 'High Risk'];
  const distValues = dist.counts || [0, 0, 0];

  const trend = data.trend || { dates: [], values: [] };
  
  // Safely extract and convert trend data
  let trendDates = [];
  let trendValues = [];
  
  if (trend && trend.dates) {
    trendDates = Array.isArray(trend.dates) ? trend.dates.slice(-10) : [];
  }
  
  if (trend && trend.values) {
    // Handle if values is an object (dict) instead of array
    if (Array.isArray(trend.values)) {
      trendValues = trend.values.slice(-10);
    } else if (typeof trend.values === 'object') {
      trendValues = Object.values(trend.values).slice(-10);
    } else {
      trendValues = [];
    }
  }

  // Risk distribution pie chart
  const pieData = {
    labels: distLabels,
    datasets: [{
      data: distValues,
      backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
      borderColor: 'white',
      borderWidth: 2
    }]
  };

  // Risk category breakdown (simulated)
  const categoryData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [{
      label: 'Patient Count',
      data: distValues,
      backgroundColor: ['rgba(76, 175, 80, 0.7)', 'rgba(255, 193, 7, 0.7)', 'rgba(244, 67, 54, 0.7)'],
      borderColor: ['#4caf50', '#ffc107', '#f44336'],
      borderWidth: 2
    }]
  };

  // Risk trend line chart
  const lineData = {
    labels: trendDates.length > 0 ? trendDates : ['No data'],
    datasets: [{
      label: 'Average Risk %',
      data: trendValues.length > 0 ? trendValues.map(v => typeof v === 'number' ? v : 0) : [0],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#1976d2',
      pointBorderColor: 'white',
      pointBorderWidth: 2
    }]
  };

  // Calculate average risk from trend values or distribution
  let avgRisk = 'N/A';
  if (trendValues.length > 0) {
    const sum = trendValues.reduce((a, b) => (typeof a === 'number' ? a : 0) + (typeof b === 'number' ? b : 0), 0);
    avgRisk = (sum / trendValues.length).toFixed(1);
  } else if (distValues.length > 0 && (distValues[0] + distValues[1] + distValues[2]) > 0) {
    const totalCount = distValues[0] + distValues[1] + distValues[2];
    const weightedAvg = (distValues[0] * 35 + distValues[1] * 70 + distValues[2] * 95) / totalCount;
    avgRisk = weightedAvg.toFixed(1);
  }

  // Calculate median risk trend
  let medianTrend = 'N/A';
  if (trendValues.length > 0) {
    const sorted = [...trendValues].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    medianTrend = sorted.length % 2 !== 0 ? sorted[mid].toFixed(1) : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
  }

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    border: 'none',
    borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.3s'
  });

  return (
    <div>
      <div className="navbar">
        <h2>Analytics Dashboard</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-danger">Back to Dashboard</button>
      </div>

      {/* Tab Navigation */}
      <div style={{ borderBottom: '2px solid var(--light-bg)', marginBottom: '24px', display: 'flex', background: 'white' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={tabStyle(activeTab === 'dashboard')}
        >
          📊 Dashboard Analytics
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          style={tabStyle(activeTab === 'recommendations')}
        >
          💡 Recommendations
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Total Assessments</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {data.count || 0}
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Average Risk</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success)' }}>
                {avgRisk}%
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--warning)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>High Risk Patients</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--warning)' }}>
                {distValues[2] || 0}
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--info)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Median Risk Trend</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--info)' }}>
                {medianTrend}%
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Pie Chart - Risk Distribution */}
            <div className="card">
              <h4 style={{ margin: '0 0 20px 0', color: 'var(--primary)' }}>📈 Risk Distribution (Pie)</h4>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { padding: 15, font: { size: 12 } } },
                      tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.7)', titleFont: { size: 13 }, bodyFont: { size: 12 } }
                    }
                  }}
                />
              </div>
            </div>

            {/* Bar Chart - Risk Categories */}
            <div className="card">
              <h4 style={{ margin: '0 0 20px 0', color: 'var(--primary)' }}>📊 Patient Count by Risk Category</h4>
              <Bar
                data={categoryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.7)', titleFont: { size: 13 }, bodyFont: { size: 12 } }
                  },
                  scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                    x: { grid: { display: false } }
                  }
                }}
              />
            </div>
          </div>

          {/* Trend Chart */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 20px 0', color: 'var(--primary)' }}>📉 Risk Trend Over Time</h4>
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom', labels: { padding: 15, font: { size: 12 } } },
                  tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.7)', titleFont: { size: 13 }, bodyFont: { size: 12 } }
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                  },
                  x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '20px' }}>🎯 Risk Reduction Recommendations</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Clinical Recommendations */}
              <div style={{ background: 'var(--light-bg)', padding: '20px', borderRadius: 'var(--border-radius)', borderLeft: '4px solid var(--primary)' }}>
                <h4 style={{ margin: '0 0 16px 0', color: 'var(--primary)', fontSize: '15px' }}>📋 Clinical Recommendations</h4>
                <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Schedule regular cardiac evaluations (every 6 months for high-risk patients)</li>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Monitor blood pressure continuously and maintain readings &lt; 130/80 mmHg</li>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Manage cholesterol through diet and medications if needed</li>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Control diabetes strictly with HbA1c target &lt; 7%</li>
                  <li style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Consult cardiologist for ECG abnormalities</li>
                </ul>
              </div>

              {/* Lifestyle Recommendations */}
              <div style={{ background: 'var(--light-bg)', padding: '20px', borderRadius: 'var(--border-radius)', borderLeft: '4px solid var(--secondary)' }}>
                <h4 style={{ margin: '0 0 16px 0', color: 'var(--secondary)', fontSize: '15px' }}>🏃 Lifestyle Recommendations</h4>
                <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Exercise 150 minutes per week (moderate-intensity aerobic activity)</li>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Quit smoking immediately; seek smoking cessation programs</li>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Reduce alcohol consumption to &lt; 2 drinks/day for men</li>
                  <li style={{ marginBottom: '8px', color: 'var(--text-dark)', fontSize: '14px' }}>Follow Mediterranean diet rich in fruits, vegetables, omega-3 fatty acids</li>
                  <li style={{ color: 'var(--text-dark)', fontSize: '14px' }}>Get 7-9 hours of quality sleep every night</li>
                </ul>
              </div>
            </div>

            {/* Stress & Mental Health */}
            <div style={{ background: 'linear-gradient(135deg, var(--light-bg), white)', padding: '20px', borderRadius: 'var(--border-radius)', borderLeft: '4px solid var(--success)', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--success)', fontSize: '15px' }}>😌 Mental Health & Stress Management</h4>
              <p style={{ margin: '0 0 12px 0', color: 'var(--text-dark)', fontSize: '14px', lineHeight: '1.6' }}>
                Chronic stress increases cardiac risk significantly. Consider practicing mindfulness, meditation, yoga, or speaking with a therapist. Maintain work-life balance and engage in relaxing hobbies.
              </p>
            </div>

            {/* Risk Stratification Table */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--primary)' }}>📊 Risk Stratification Guide</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'var(--primary)', color: 'white' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Risk Category</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Probability Range</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(76, 175, 80, 0.1)', borderBottom: '1px solid var(--light-bg)' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--success)' }}>Low Risk</td>
                    <td style={{ padding: '12px' }}>0 - 30%</td>
                    <td style={{ padding: '12px' }}>Annual screening, maintain healthy lifestyle</td>
                  </tr>
                  <tr style={{ background: 'rgba(255, 193, 7, 0.1)', borderBottom: '1px solid var(--light-bg)' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--warning)' }}>Medium Risk</td>
                    <td style={{ padding: '12px' }}>30 - 70%</td>
                    <td style={{ padding: '12px' }}>Semi-annual screening, aggressive lifestyle modification</td>
                  </tr>
                  <tr style={{ background: 'rgba(244, 67, 54, 0.1)' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--danger)' }}>High Risk</td>
                    <td style={{ padding: '12px' }}>70 - 100%</td>
                    <td style={{ padding: '12px' }}>Quarterly evaluation, medication, close cardiology monitoring</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
