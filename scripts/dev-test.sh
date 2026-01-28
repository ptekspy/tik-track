#!/bin/bash
# Start Next.js dev server with test database

echo "Starting dev server with test database (.env.test)..."

# Set NODE_ENV=test so Next.js automatically loads .env.test
NODE_ENV=test next dev
