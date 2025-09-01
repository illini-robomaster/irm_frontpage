# Illini RoboMaster - Frontpage

The static website for the Illini RoboMaster competitive robotics team at the
University of Illinois.

## Deployment

This website can be deployed using Docker with Cloudflared integration for
secure tunneling.

### Prerequisites

- Docker
- Docker Compose

### Deployment Steps

1. Run the deployment script:

   ```bash
   ./scripts/docker-deploy.sh
   ```

The deployment script will automatically:
- Build a custom Alpine-based Docker image with cloudflared installed
- Configure lighttpd as a reverse proxy
- Start both services with proper networking

### Cloudflared Integration

To enable Cloudflared tunneling:

1. Create a Cloudflare account and set up a tunnel
2. Obtain your tunnel token
3. Set the tunnel token as an environment variable:

   ```bash
   export CLOUDFLARED_TUNNEL_TOKEN=your_actual_tunnel_token
   ```

4. Run the deployment script

### Direct Access

The website will be available at:

- <http://localhost:80> (through lighttpd)
- <http://localhost:8080> (direct access to the web content)

### Configuration Files

- `src/cloudflared/config.yml` - Template for Cloudflared configuration
- `Dockerfile` - Custom Docker image definition
- `docker-compose.yml` - Docker Compose configuration
- `scripts/docker-deploy.sh` - Deployment script
