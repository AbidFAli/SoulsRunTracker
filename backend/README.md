# Setup
1. `cp .env.example .env`
2. Fill out .env
  * Generate a password using `openssl rand -hex 12`
3. `ln -v -s ../../.env docker/development/.env`