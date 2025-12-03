# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG PROJECT_FOLDER=../../../

FROM mcr.microsoft.com/devcontainers/typescript-node:24

# Use production node environment by default.
ENV NODE_ENV development

WORKDIR /usr/src/app
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends vim
RUN su node -c "npm install -g ts-node"

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.

# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --omit=dev


# Copy the rest of the source files into the image.
COPY ${PROJECT_FOLDER} .

# Expose the port that the application listens on.
EXPOSE ${APP_PORT}

CMD tail -f /dev/null