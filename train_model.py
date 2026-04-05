import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib
import os

# Create sample data (replace with actual dataset)
np.random.seed(42)
n_samples = 1000

data = {
    'age': np.random.randint(20, 80, n_samples),
    'sex': np.random.choice([0, 1], n_samples),  # 0: female, 1: male
    'blood_pressure': np.random.normal(120, 20, n_samples),
    'cholesterol': np.random.normal(200, 40, n_samples),
    'fasting_blood_sugar': np.random.normal(100, 15, n_samples),
    'ecg_results': np.random.choice([0, 1, 2], n_samples),
    'max_heart_rate': np.random.randint(60, 200, n_samples),
    'chest_pain_type': np.random.choice([0, 1, 2, 3], n_samples),
    'smoking_status': np.random.choice([0, 1, 2], n_samples),
    'alcohol_consumption': np.random.choice([0, 1, 2, 3], n_samples),
    'physical_activity': np.random.choice([0, 1, 2], n_samples),
    'diet_pattern': np.random.choice([0, 1], n_samples),
    'stress_level': np.random.choice([0, 1, 2], n_samples),
    'sleep_duration': np.random.normal(7, 2, n_samples),
    'family_history': np.random.choice([0, 1], n_samples),
    'target': np.random.choice([0, 1], n_samples)  # 0: No disease, 1: Disease
}

df = pd.DataFrame(data)

# Split features and target
X = df.drop('target', axis=1)
y = df['target']

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model and scaler
model_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(model_dir, exist_ok=True)

joblib.dump(model, os.path.join(model_dir, 'cardiac_rf_model.pkl'))
joblib.dump(scaler, os.path.join(model_dir, 'scaler.pkl'))

print("Model and scaler saved successfully!")