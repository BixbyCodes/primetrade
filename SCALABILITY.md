# Scalability & Architecture Notes

## Current Architecture

```
Client (React) → REST API (Express) → MongoDB
```

## Scaling Strategies

### 1. Horizontal Scaling + Load Balancing
Run multiple Node.js instances behind an Nginx or AWS ALB load balancer.
Use PM2 cluster mode for multi-core CPU utilization on a single machine.
MongoDB Atlas supports auto-sharding for horizontal DB scaling.

### 2. Caching with Redis
Cache frequently read endpoints (e.g., user profiles, admin stats) in Redis.
Use redis-based rate limiting (ioredis + rate-limit-redis) instead of in-memory,
so limits work correctly across multiple server instances.

### 3. Microservices (future)
When the app grows, split into:
- Auth Service (JWT issuance & verification)
- Task Service (CRUD operations)
- Notification Service (email/webhook on task changes)
- API Gateway handles routing and auth verification

### 4. Message Queues
For async operations (emails, webhook notifications), use a queue like
BullMQ (Redis-backed) or AWS SQS to decouple processing from the HTTP response cycle.

### 5. Database Indexing
Current: compound index on { owner, status } for fast task queries.
Additional recommended indexes:
  - { email: 1 } on User (already unique index)
  - { createdAt: -1 } for sorting

### 6. Docker Deployment
The project is container-ready. Run with:
  docker-compose up --build

Enables easy deployment to AWS ECS, Railway, Render, or any container platform.

### 7. API Versioning
Routes are versioned at /api/v1/ — adding /api/v2/ in the future
requires zero changes to existing clients.
