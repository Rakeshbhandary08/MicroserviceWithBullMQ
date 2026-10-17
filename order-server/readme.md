## BULL MQ
-> IT is a node js library used for running background works using queue.

## Queue Events
QueueEvents lets us  listen to what's happening to jobs in a queue.

# BullMQ Order Service

A beginner project to learn **BullMQ** (job queues in Node.js) using Redis.

## What it does
When a user places an order:
1. The API adds a **verification job** to a queue.
2. A **verification worker** checks if the user is valid.
3. If valid, the API adds a **mail job** to a second queue.
4. A **mail worker** sends a confirmation email to the user.

## What I learned
- What queues, jobs, and workers are
- Adding jobs with `Queue.add()` and processing them with `Worker`
- Using `QueueEvents` / `waitUntilFinished` to get a job's result back in the API
- Running Redis in Docker and inspecting queues with RedisInsight
- Splitting work into multiple services (API, verification worker, mail worker)

## Tech stack
Node.js, Express, BullMQ, Redis (Docker), ioredis

## Run it
1. Start Redis: `docker run -d --name redis -p 6379:6379 redis`
2. Install packages: `npm install`
3. Start each service in its own terminal:
   - `node app.js` (API on port 4800)
   - `node worker.js` (verification worker)
   - `node mailWorker.js` (mail worker)
4. Test:
```bash
   curl -X POST http://localhost:4800/order -H "Content-Type: application/json" -d '{"userId":1}'
```

## Planned improvements
- Connect a real MongoDB database
- Send real emails with Nodemailer
- Add retries, error handling, and cleaner code structure