import requests
import os
import time

BASE = 'http://127.0.0.1:5000'
TEST_USER = {
    'username': 'e2e_user',
    'password': 'E2Epass!23',
    'email': 'e2e_user@example.com'
}

uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

# Ensure there's a test ECG file
test_ecg = os.path.join(uploads_dir, 'e2e_test_ecg.png')
if not os.path.exists(test_ecg):
    # create a simple image
    from PIL import Image, ImageDraw
    img = Image.new('RGB', (800, 300), 'white')
    d = ImageDraw.Draw(img)
    d.line((50, 150, 750, 150), fill='gray')
    for x in range(50, 750):
        y = 150 + int(30 * (0.5 - (x % 40) / 40.0))
        d.point((x, y), fill='black')
    img.save(test_ecg)

session = requests.Session()

def register():
    url = BASE + '/api/auth/register'
    resp = session.post(url, json=TEST_USER, timeout=10)
    return resp

def login():
    url = BASE + '/api/auth/login'
    resp = session.post(url, json={'username': TEST_USER['username'], 'password': TEST_USER['password']}, timeout=10)
    return resp

def submit_clinical(token):
    url = BASE + '/api/data/clinical'
    headers = {'Authorization': f'Bearer {token}'}
    files = {
        'ecg_image': open(test_ecg, 'rb')
    }
    data = {
        'age': '60', 'sex': 'male', 'blood_pressure': '140', 'cholesterol': '220',
        'fasting_blood_sugar': '110', 'ecg_results': 'normal', 'max_heart_rate': '150', 'chest_pain_type': 'typical_angina'
    }
    resp = session.post(url, headers=headers, files=files, data=data, timeout=20)
    return resp

def submit_lifestyle(token):
    url = BASE + '/api/data/lifestyle'
    headers = {'Authorization': f'Bearer {token}'}
    payload = {
        'smoking_status': 'never', 'alcohol_consumption': 'low', 'physical_activity': 'moderate',
        'diet_pattern': 'healthy', 'stress_level': 'low', 'sleep_duration': 7.5, 'family_history': False
    }
    resp = session.post(url, headers=headers, json=payload, timeout=10)
    return resp

def predict(token):
    url = BASE + '/api/predict/'
    headers = {'Authorization': f'Bearer {token}'}
    resp = session.post(url, headers=headers, timeout=20)
    return resp

if __name__ == '__main__':
    print('Starting E2E test...')
    try:
        # Register (ignore 400 if user exists)
        r = register()
        print('Register:', r.status_code, r.text)
    except Exception as e:
        print('Register error:', e)
    try:
        r = login()
        print('Login:', r.status_code, r.text)
        token = r.json().get('access_token')
        if not token:
            print('Login failed, aborting')
            raise SystemExit(1)
    except Exception as e:
        print('Login error:', e)
        raise

    try:
        r = submit_clinical(token)
        print('Submit clinical:', r.status_code, r.text)
        if r.status_code >= 400:
            raise Exception('Clinical submission failed')
    except Exception as e:
        print('Clinical error:', e)
        raise

    time.sleep(0.5)
    try:
        r = submit_lifestyle(token)
        print('Submit lifestyle:', r.status_code, r.text)
        if r.status_code >= 400:
            raise Exception('Lifestyle submission failed')
    except Exception as e:
        print('Lifestyle error:', e)
        raise

    time.sleep(0.5)
    try:
        r = predict(token)
        print('Predict:', r.status_code)
        print(r.text)
        if r.status_code >= 400:
            raise Exception('Prediction failed')
        data = r.json()
        # verify image urls accessible
        ecg_url = data.get('prediction', {}).get('ecg_image_url') or data.get('explanation', {}).get('ecg_image_url')
        heat_url = data.get('explanation', {}).get('ecg_heatmap_url')
        for url in [ecg_url, heat_url]:
            if url:
                try:
                    rr = session.get(url, timeout=10)
                    print('GET', url, '->', rr.status_code)
                except Exception as e:
                    print('Failed to GET', url, e)
    except Exception as e:
        print('Prediction error:', e)
        raise

    print('E2E test completed successfully')
