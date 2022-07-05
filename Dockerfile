FROM cloudron/base:3.0.0@sha256:455c70428723e3a823198c57472785437eb6eab082e79b3ff04ea584faf46e92

RUN mkdir -p /app/code
WORKDIR /app/code
ENV MC_VERSION=1.19 \
    PMC_VERSION=1.19-50 \
    REV=50

RUN apt-get update && apt-get install -y openjdk-17-jdk-headless && rm -rf /var/cache/apt /var/lib/apt/lists

RUN curl -L https://papermc.io/api/v2/projects/paper/versions/${MC_VERSION}/builds/${REV}/downloads/paper-${PMC_VERSION}.jar -o minecraft_server.jar

COPY frontend /app/code/frontend
COPY backend /app/code/backend
COPY index.js package.json package-lock.json start.sh /app/code/

RUN npm install && \
    chown -R cloudron:cloudron /app/code/backend /app/code/frontend

CMD [ "/app/code/start.sh" ]
