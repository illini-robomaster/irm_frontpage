# RoboMaster 2026 Portal - Quick Start

## What's Been Done ✅

1. **Portal Files Integrated**
   - Copied all portal files to `src/html/portal/`
   - Updated main website navigation (`src/html/index.html`)
   - Login button now points to `/portal/login.html`

2. **Backend Server Ready**
   - Created `backend/upload_server.py` - Flask API for video uploads
   - Created `backend/requirements.txt` - Python dependencies
   - Created `backend/robomaster-upload.service` - Systemd service config

3. **Documentation Created**
   - `DEPLOYMENT_GUIDE.md` - Comprehensive deployment instructions
   - This file

## To Deploy - 3 Easy Steps

### Step 1: Push to GitHub

**Important**: Open **Git Bash** (not PowerShell) and run:

```bash
cd "/c/Users/Anony/OneDrive/Desktop/RM/irm_frontpage"

git add .
git commit -m "Add 2026 season team portal with video upload"
git push origin main
```

Wait 5 minutes - your changes will automatically appear on illinirobomaster.com!

### Step 2: Deploy Backend (on server)

SSH to your server and run:

```bash
# Navigate to web root
cd /var/www/html

# Create backend directory if needed
mkdir -p backend
cd backend

# Copy these files from the repo:
# - backend/upload_server.py
# - backend/requirements.txt
# - backend/robomaster-upload.service

# Install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install systemd service
sudo cp robomaster-upload.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable robomaster-upload.service
sudo systemctl start robomaster-upload.service

# Check status
sudo systemctl status robomaster-upload.service
```

### Step 3: Configure Web Server

Add proxy configuration to route `/api/` requests to the Flask backend on port 5000.

See `DEPLOYMENT_GUIDE.md` for detailed Lighttpd/Nginx configuration.

## Testing

1. Visit https://illinirobomaster.com
2. Click "Team Portal" in navigation
3. Login (see `src/html/portal/auth.js` for user credentials)
4. Navigate through all 5 modules
5. Test video upload on Robot Status page

## Portal Features

- **Dashboard**: Countdown to competition (Jan 29, 2026 15:00 Beijing time)
- **Project Docs**: PDFs and 3D model links
- **Robot Status**: Video upload/management for robot demonstrations
- **Robot Planning**: Data viewer for 26 robots across 4 schools
- **Meeting Minutes**: 89 paragraphs of meeting notes

## File Structure

```
irm_frontpage/
├── backend/
│   ├── upload_server.py          # Flask API server
│   ├── requirements.txt          # Python dependencies
│   └── robomaster-upload.service # Systemd service config
├── src/
│   └── html/
│       ├── index.html            # Main page (updated with portal link)
│       └── portal/               # Portal files
│           ├── login.html
│           ├── dashboard.html
│           ├── robot-status.html
│           ├── robot-planning.html
│           ├── meeting-minutes.html
│           ├── project-docs.html
│           ├── auth.js           # 40 user credentials
│           ├── styles.css
│           ├── data/             # Excel, Word, PDF files
│           └── videos/           # 3 test videos
├── DEPLOYMENT_GUIDE.md
└── PORTAL_README.md              # This file
```

## User Accounts

All 40 users are in `src/html/portal/auth.js`.
- Username: Chinese name OR English name
- Password: Same as username

Example: Username `赵一` or `Zhao Yi`, Password `赵一` or `Zhao Yi`

## Important Notes

- Auto-deployment: Changes appear in ~5 minutes after git push
- Upload limit: 500MB per video file
- Backend required: Flask server must run for upload/delete features
- Storage: Portal uses browser localStorage for metadata

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
