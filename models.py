from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='doctor')  # doctor or healthcare_staff
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ClinicalData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.String(10), nullable=False)  # male/female
    blood_pressure = db.Column(db.Float, nullable=False)
    cholesterol = db.Column(db.Float, nullable=False)
    fasting_blood_sugar = db.Column(db.Float, nullable=False)
    ecg_results = db.Column(db.String(50), nullable=False)
    max_heart_rate = db.Column(db.Integer, nullable=False)
    chest_pain_type = db.Column(db.String(50), nullable=False)
    ecg_image_path = db.Column(db.String(255), nullable=True)  # path to uploaded ECG image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LifestyleData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    smoking_status = db.Column(db.String(20), nullable=False)  # never/former/current
    alcohol_consumption = db.Column(db.String(20), nullable=False)  # none/low/moderate/high
    physical_activity = db.Column(db.String(20), nullable=False)  # low/moderate/high
    diet_pattern = db.Column(db.String(20), nullable=False)  # healthy/unhealthy
    stress_level = db.Column(db.String(20), nullable=False)  # low/moderate/high
    sleep_duration = db.Column(db.Float, nullable=False)  # hours
    family_history = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    clinical_data_id = db.Column(db.Integer, db.ForeignKey('clinical_data.id'), nullable=False)
    lifestyle_data_id = db.Column(db.Integer, db.ForeignKey('lifestyle_data.id'), nullable=False)
    risk_class = db.Column(db.String(10), nullable=False)  # low/high
    risk_probability = db.Column(db.Float, nullable=False)
    image_probability = db.Column(db.Float, nullable=True)  # probability from image model
    combined_probability = db.Column(db.Float, nullable=True)  # combined (ensemble) probability
    model_accuracy = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)