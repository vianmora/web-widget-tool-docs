---
sidebar_position: 3
title: Reverse Proxy
---

# Reverse Proxy

WebWidgetTool runs on port `4000` by default. In production you should put a reverse proxy in front to:
- Handle HTTPS / TLS termination
- Expose the app on port 80/443
- Optionally serve it under a subdomain or path

## Nginx

### Basic HTTP (no TLS)

```nginx
server {
    listen 80;
    server_name your-app.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### With TLS (Certbot / Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-app.com
```

Certbot will automatically modify your Nginx config to add TLS.

Full HTTPS config:

```nginx
server {
    listen 80;
    server_name your-app.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-app.com;

    ssl_certificate     /etc/letsencrypt/live/your-app.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-app.com/privkey.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

:::important Update FRONTEND_URL and APP_URL
After setting up HTTPS, update your `.env` to use `https://`:
```bash
FRONTEND_URL=https://your-app.com
APP_URL=https://your-app.com
```
Then restart the app: `docker compose ... restart app`
:::

---

## Caddy

Caddy handles TLS automatically with zero config.

### Caddyfile

```
your-app.com {
    reverse_proxy localhost:4000
}
```

Start Caddy:

```bash
caddy run --config Caddyfile
```

That's it. Caddy fetches and renews the Let's Encrypt certificate automatically.

---

## Traefik

If you're using Traefik (common with Coolify or Docker Swarm), add labels to the `app` service in your compose file:

```yaml
services:
  app:
    image: vianmora/web-widget-tool:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.webwidget.rule=Host(`your-app.com`)"
      - "traefik.http.routers.webwidget.entrypoints=websecure"
      - "traefik.http.routers.webwidget.tls.certresolver=letsencrypt"
      - "traefik.http.services.webwidget.loadbalancer.server.port=4000"
```

---

## widget.js across domains

`widget.js` and `/widget/*` routes have **open CORS** (`Access-Control-Allow-Origin: *`). Your visitors' websites will be able to load and run the widgets regardless of their domain — no additional proxy configuration needed for this.

Only the dashboard (`/api/*`) is restricted to `FRONTEND_URL`.
