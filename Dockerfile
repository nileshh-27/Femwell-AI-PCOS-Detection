# Render deployment: Node + Python runtime for API + ML inference
FROM node:20-bookworm-slim

WORKDIR /app

# System deps for Python inference
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

# Install Node deps (includes devDeps for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Install Python deps for ML inference
RUN pip3 install --no-cache-dir -r dataset/requirements.txt

# Build client+server into dist/
RUN npm run build

ENV NODE_ENV=production
ENV PCOS_PYTHON=python3

EXPOSE 5000

CMD ["npm", "start"]
