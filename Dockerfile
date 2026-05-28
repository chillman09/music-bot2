FROM node:20-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    build-essential \
    && pip3 install yt-dlp --break-system-packages \
    && apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --ignore-scripts
RUN npm rebuild sodium-native --legacy-peer-deps

COPY . .

CMD ["node", "index.js"]
