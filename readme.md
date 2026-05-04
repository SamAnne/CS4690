# Description
This project is a multi-tenant web application for tracking student academic logs across multiple institutions (UVU and University of Utah). Students submit logs per course, teachers and TAs manage course rosters and view logs, and admins have full control over users and courses. Each institution is fully isolated — users can only access data belonging to their school.

# Getting Started
In order to run the program, use these command:

```bash
npm run dev
```

This will locally host with the port 3000 and can be accessed at localhost:3000.

# Commands

## Install dependencies

```bash
npm install
```

## Seed admin users for both schools (run once)

```bash
npx ts-node server/db/seedAdmin.ts
```

## Build TypeScript

```bash
npm run build
```

## Start the server

```bash
npm start
```

## Run unit tests

```bash
npm test
```
