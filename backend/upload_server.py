from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import hashlib

app = Flask(__name__)
CORS(app)

# Configure upload folder - use absolute path on server
# Update this path based on your server deployment location
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'src', 'html', 'portal', 'videos')
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm', 'mkv'}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    """Upload video file endpoint"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed: mp4, avi, mov, webm, mkv'}), 400
    
    try:
        original_filename = secure_filename(file.filename)
        file_content = file.read()
        
        # Generate hash-based filename to avoid conflicts
        file_hash = hashlib.md5(file_content).hexdigest()
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        new_filename = f"{file_hash}.{file_extension}"
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        
        # Ensure upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Save file
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        return jsonify({
            'success': True,
            'filename': new_filename,
            'original_name': original_filename
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete', methods=['POST'])
def delete_file():
    """Delete video file endpoint"""
    data = request.json
    if not data or 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    filename = secure_filename(data['filename'])
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True}), 200
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Run server
    # For production, use gunicorn instead
    app.run(host='0.0.0.0', port=5000, debug=False)
