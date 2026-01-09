# Render deployment: Node + Python runtime for API + ML inference
FROM node:20-bookworm-slim

WORKDIR /app

# System deps for Python inference
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip python3-venv \
  && rm -rf /var/lib/apt/lists/*

# Create an isolated Python environment (avoids PEP 668 "externally-managed-environment")
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python deps for ML inference (cached layer)
COPY dataset/requirements.txt ./dataset/requirements.txt
RUN pip install --no-cache-dir -r dataset/requirements.txt

# Install Node deps (includes devDeps for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build client+server into dist/
RUN npm run build

ENV NODE_ENV=production
ENV PCOS_PYTHON=python

EXPOSE 5000

CMD ["npm", "start"]
