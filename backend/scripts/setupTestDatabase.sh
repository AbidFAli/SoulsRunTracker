#!/usr/bin/bash
source .env.test

npx prisma db push --accept-data-loss --skip-generate
