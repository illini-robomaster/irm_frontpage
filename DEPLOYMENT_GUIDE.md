# RoboMaster 2026 Portal Deployment Guide

## Files Successfully Integrated ✅

Portal files have been copied to: `src/html/portal/`
- All HTML pages (login, dashboard, robot-status, robot-planning, meeting-minutes, project-docs)
- All JavaScript modules (auth.js, common.js, robot-status.js, etc.)
- CSS styles (styles.css)
- Data folder (Excel, Word, PDF files)
- Videos folder (3 video files)

Main website updated:
- `src/html/index.html` - Login link changed to "Team Portal" → `/portal/login.html`

## Next Steps to Deploy

### 1. Commit and Push to GitHub

Open **Git Bash** (not PowerShell) and run:

```bash
cd "/c/Users/Anony/OneDrive/Desktop/RM/irm_frontpage"

# Add all changes
git add .

# Commit with message
git commit -m "Add 2026 season team portal with 5 modules

- Add team login system (40 users)
- Add dashboard with countdown to Jan 29 2026
- Add meeting minutes page
- Add robot planning data viewer (26 robots)
- Add project documentation links
- Add robot status page with video upload
- Update main page navigation to include portal link"

# Push to GitHub
git push origin main
```

**Note**: The auto-deployment system will pull changes every 5 minutes, so your portal will appear on illinirobomaster.com within 5 minutes after pushing.

### 2. Deploy Upload Server Backend

The portal's video upload feature requires a Flask backend server. Follow these steps:

#### A. Create Backend Directory on Server

SSH to illinirobomaster.com server:
```bash
ssh user@illinirobomaster.com
cd /var/www/html/src/portal
mkdir backend
cd backend
```

#### B. Upload Backend Files

Create `upload_server.py` on server:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import hashlib

app = Flask(__name__)
CORS(app)

# Configure upload folder - use absolute path on server
UPLOAD_FOLDER = '/var/www/html/src/portal/videos'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm', 'mkv'}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        original_filename = secure_filename(file.filename)
        file_content = file.read()
        
        # Generate hash-based filename
        file_hash = hashlib.md5(file_content).hexdigest()
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        new_filename = f"{file_hash}.{file_extension}"
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        
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
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=False)
```

#### C. Create requirements.txt

```txt
flask>=3.0.0
flask-cors>=4.0.0
gunicorn>=21.2.0
```

#### D. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or use venv:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### E. Create Systemd Service

Create `/etc/systemd/system/robomaster-upload.service`:

```ini
[Unit]
Description=RoboMaster Portal Upload Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/src/portal/backend
Environment="PATH=/var/www/html/src/portal/backend/venv/bin"
ExecStart=/var/www/html/src/portal/backend/venv/bin/gunicorn \
    --workers 2 \
    --bind 0.0.0.0:5000 \
    --timeout 300 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    upload_server:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### F. Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable robomaster-upload.service
sudo systemctl start robomaster-upload.service

# Check status
sudo systemctl status robomaster-upload.service
```

### 3. Configure Web Server Proxy

You need to configure Lighttpd (or Nginx if you switch) to proxy API requests to the Flask backend.

#### For Lighttpd:

Edit `/etc/lighttpd/lighttpd.conf` or create `/etc/lighttpd/conf-available/robomaster-proxy.conf`:

```
server.modules += ( "mod_proxy" )

$HTTP["url"] =~ "^/api/" {
    proxy.server = ( "" => (
        ( 
            "host" => "127.0.0.1",
            "port" => 5000
        )
    ))
}
```

Then:
```bash
sudo ln -s /etc/lighttpd/conf-available/robomaster-proxy.conf /etc/lighttpd/conf-enabled/
sudo systemctl reload lighttpd
```

#### For Nginx (if switching):

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
    # Allow large uploads (500MB)
    client_max_body_size 500M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
}
```

### 4. Update Frontend API Configuration

Edit `src/portal/robot-status.js`, change line ~2:

```javascript
// Change from:
const UPLOAD_SERVER = 'http://localhost:5000';

// To:
const UPLOAD_SERVER = '/api';
```

This makes the frontend use relative URLs which will be proxied to the Flask backend.

### 5. Set Permissions

```bash
# Ensure web server can write to videos folder
sudo chown -R www-data:www-data /var/www/html/src/portal/videos
sudo chmod -R 755 /var/www/html/src/portal/videos
```

### 6. Test

After deployment:

1. Visit `https://illinirobomaster.com`
2. Click "Team Portal" button in navigation
3. Login with any of the 40 user accounts (see auth.js for credentials)
4. Navigate to "Robot Status" page
5. Try uploading a video file
6. Verify video appears in the list
7. Test delete functionality

## Troubleshooting

### Upload server not working:
```bash
# Check service status
sudo systemctl status robomaster-upload.service

# View logs
sudo journalctl -u robomaster-upload.service -f

# Test health endpoint
curl http://localhost:5000/health
```

### Videos not displaying:
- Check videos folder permissions: `ls -la /var/www/html/src/portal/videos`
- Verify video files exist: `ls /var/www/html/src/portal/videos`
- Check browser console for errors

### Auto-deployment not working:
- Verify the auto-pull cron job is running: `crontab -l`
- Check git pull works manually: `cd /var/www/html && git pull`
- Ensure no merge conflicts: `git status`

## Current User Accounts

See `src/portal/auth.js` for all 40 users. Example accounts:
- 赵一 / Zhao Yi
- 钱二 / Qian Er
- 孙三 / Sun San
...

All users have password: (their names are both username and password)

## Portal Features

1. **Dashboard**: Countdown to Jan 29, 2026 15:00 Beijing time
2. **Project Docs**: Links to 4 PDFs and Onshape 3D model
3. **Robot Status**: Video upload/delete for robot demonstrations
4. **Robot Planning**: View 26 robots across 4 schools with filtering
5. **Meeting Minutes**: 89 paragraphs of meeting notes with inline editing

## Important Notes

- Videos folder currently has 3 test videos totaling ~50MB
- Upload limit is 500MB per file
- Auto-deployment runs every 5 minutes
- Portal uses localStorage for metadata persistence
- Backend must be running for upload/delete to work
