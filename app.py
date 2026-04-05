from flask import Flask, send_from_directory, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, User, ClinicalData, LifestyleData, Prediction, Log
from routes.auth import auth_bp
from routes.data import data_bp
from routes.prediction import prediction_bp
from routes.dashboard import dashboard_bp
import os

# Serve React build from frontend/build when in production
static_folder_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build')
instance_path = os.path.join(os.path.dirname(__file__), 'instance')
os.makedirs(instance_path, exist_ok=True)

app = Flask(__name__, static_folder=None, instance_path=instance_path)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change in production
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-here'  # Change in production
db_path = os.path.abspath(os.path.join(instance_path, 'cardiac_risk.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
CORS(app)
JWTManager(app)
db.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(data_bp, url_prefix='/api/data')
app.register_blueprint(prediction_bp, url_prefix='/api/predict')
app.register_blueprint(dashboard_bp, url_prefix='/api/analytics')

# Serve uploaded files (ECG images)
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    return send_from_directory(uploads_dir, filename)

# Serve React app (client-side routing support)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Check if it's an API call (should not reach here as blueprints handle /api/*)
    if path.startswith('api/'):
        return {'error': 'Not Found'}, 404
    
    # Try to serve static files first
    static_path = os.path.join(static_folder_path, path)
    if path and os.path.isfile(static_path):
        return send_from_directory(static_folder_path, path)
    
    # For all other routes, serve index.html (React Router will handle routing)
    return send_file(os.path.join(static_folder_path, 'index.html'))

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)