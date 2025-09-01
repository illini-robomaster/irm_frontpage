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
   ./deploy.sh
   ```

The deployment script will automatically:

- Build a custom Alpine-based Docker image if not present
- Ask for Cloudflared tunnel credentials if not cached
- Start the container

If you see `Unsupported config option for services: 'web'`, add `version: "3"`
to the start of `docker-compose.yml`:

```yml
...
# GNU General Public License for more details.
#
version: "3"  # Add this

services:
  web:
...
```

### Direct Access

The website will be available locally at:

- <http://localhost:8081>
