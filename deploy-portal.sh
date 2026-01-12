#!/bin/bash
# Quick Git Deployment Script for RoboMaster Portal
# Run this in Git Bash on Windows: bash deploy-portal.sh

# Navigate to repository
cd "/c/Users/Anony/OneDrive/Desktop/RM/irm_frontpage"

# Show current status
echo "=== Current Git Status ==="
git status

echo ""
echo "=== Adding all changes ==="
git add .

echo ""
echo "=== Committing changes ==="
git commit -m "Add 2026 season team portal

Features:
- Team login system with 40 user accounts
- Dashboard with countdown to Jan 29, 2026 15:00
- Meeting minutes viewer (89 paragraphs)
- Robot planning data (26 robots across 4 schools)
- Project documentation links (4 PDFs + 3D model)
- Robot status page with video upload capability
- Updated main website navigation with portal link

Backend:
- Flask upload server for video management
- Systemd service configuration
- Requirements file for dependencies

Note: Backend deployment required on server for video upload feature"

echo ""
echo "=== Pushing to GitHub ==="
git push origin main

echo ""
echo "=== Done! ==="
echo "Your portal will be live on illinirobomaster.com in ~5 minutes"
echo ""
echo "Next steps:"
echo "1. Wait 5 minutes for auto-deployment"
echo "2. SSH to server and deploy backend (see DEPLOYMENT_GUIDE.md)"
echo "3. Configure web server proxy for /api/ endpoint"
echo "4. Test portal at https://illinirobomaster.com/portal/login.html"
