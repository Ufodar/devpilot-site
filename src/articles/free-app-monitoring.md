---
title: "How to Monitor Your Apps for Free"
description: "Set up complete application monitoring without spending a cent. Covers uptime checks, log management, error tracking, and performance monitoring with free tools."
date: 2026-04-26
tags: [monitoring, devops, free-tools]
layout: article.njk
---

Monitoring is one of those things every developer knows they need but postpones because the tools feel expensive or complicated to set up. The reality is that you can build a comprehensive monitoring stack for free -- one that covers uptime, errors, logs, and performance. This guide shows you how.

## Uptime Monitoring with UptimeRobot

UptimeRobot is the simplest way to know when your application goes down. The free plan monitors up to 50 endpoints at 5-minute intervals. That is more than enough for personal projects and small applications.

### Setup Steps

1. Create a free account at uptimerobot.com
2. Add a new monitor for each endpoint you want to track
3. Set the monitor type to HTTP(s) for web applications or Port for database servers
4. Configure alert contacts -- email, Slack, or Discord webhook

For API endpoints, use the HTTP(s) monitor with a keyword check. UptimeRobot will verify that the response contains a specific string, which catches situations where the server is running but returning errors.

The free plan also includes status pages. A public status page at `status.yourproject.com` builds trust with users and reduces support requests when something goes wrong.

## Error Tracking with Sentry

Sentry catches exceptions that your users encounter and sends you detailed reports with stack traces, request context, and user information. The developer plan is free for small projects with up to 5,000 errors per month.

### Integration Examples

For a Node.js application:

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  tracesSampleRate: 1.0,
});
```

For a Python application:

```bash
pip install sentry-sdk
```

```python
import sentry_sdk

sentry_sdk.init(dsn="YOUR_DSN_HERE", traces_sample_rate=1.0)
```

The `tracesSampleRate` of 1.0 means Sentry captures 100% of transactions for performance monitoring. In production with higher traffic, reduce this to 0.1 or 0.2 to stay within the free tier while still getting representative data.

Sentry groups similar errors together, so one bug affecting a hundred users appears as a single issue with an event count, not as a hundred separate alerts. This prevents alert fatigue and helps you prioritize fixes.

## Log Management with Grafana Loki

Grafana Loki is a log aggregation system designed to be cost-effective. Unlike Elasticsearch-based solutions that index every field, Loki only indexes labels (metadata), keeping storage costs dramatically lower. The open-source version is completely free.

### Quick Setup with Docker Compose

```yaml
services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - loki
```

This gives you a Loki instance for log storage and a Grafana dashboard for querying and visualization. Access Grafana at `http://localhost:3000` with the default admin/admin credentials.

To send logs from your application to Loki, use a logging driver or a Promtail sidecar. For development, the simplest approach is to write logs to stdout and let Promtail tail the container logs.

## Metrics with Prometheus

Prometheus collects and stores time-series metrics from your applications. It pulls metrics from instrumented endpoints at regular intervals, making it ideal for tracking request counts, response times, error rates, and resource usage.

### Basic Prometheus Setup

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

The `prometheus.yml` configuration:

```yaml
scrape_configs:
  - job_name: "my-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["host.docker.internal:8080"]
```

This tells Prometheus to scrape metrics from your application every 15 seconds. Most web frameworks have Prometheus client libraries that expose a `/metrics` endpoint.

For Node.js:

```javascript
const client = require("prom-client");
const register = new client.Registry();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

// In your request handler:
httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
```

## All-in-One: Better Stack Free Tier

If setting up individual tools feels like too much work, Better Stack provides a free monitoring suite that combines uptime monitoring, incident management, and status pages. The free plan covers one user with generous limits.

Better Stack's uptime monitoring is more sophisticated than UptimeRobot's. It checks from multiple geographic locations, provides detailed response time charts, and integrates with on-call scheduling. The incident management features, including automated escalation and runbooks, are typically only found in paid tools.

## Simple Health Checks

Before setting up external monitoring, add a health check endpoint to your application. This is a simple route that verifies your application's core dependencies:

```javascript
app.get("/health", async (req, res) => {
  const checks = {
    database: false,
    cache: false,
  };

  try {
    await db.query("SELECT 1");
    checks.database = true;
  } catch {}

  try {
    await redis.ping();
    checks.cache = true;
  } catch {}

  const healthy = Object.values(checks).every(Boolean);
  res.status(healthy ? 200 : 503).json({ status: healthy ? "ok" : "degraded", checks });
});
```

This endpoint tells your monitoring tool not just whether the server is responding, but whether it is actually functional. A server that cannot reach its database is not healthy, even if it returns 200 on other routes.

## Alert Fatigue Prevention

More alerts is not better monitoring. Configure alerts that are actionable and specific:

- **Alert on error rate spikes**, not individual errors. One error might be a transient issue; a sudden increase is a real problem.
- **Set appropriate thresholds.** A 500ms response time alert for an API that normally responds in 50ms is meaningful. The same threshold for an API that normally takes 2 seconds is noise.
- **Use escalation policies.** First alert on Slack. If not acknowledged in 15 minutes, send an email. If still not acknowledged, call the on-call engineer. This prevents 3 AM phone calls for issues that can wait until morning.

## Conclusion

Free monitoring tools have reached a level of maturity where cost is no longer a valid reason to skip monitoring. UptimeRobot covers availability, Sentry handles error tracking, and the Prometheus plus Grafana plus Loki stack gives you metrics, dashboards, and logs. Set them up once, and you will know about problems before your users report them.
