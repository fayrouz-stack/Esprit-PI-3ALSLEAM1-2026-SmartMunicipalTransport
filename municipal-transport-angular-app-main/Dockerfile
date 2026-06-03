FROM node:20.19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps && chmod +x node_modules/.bin/ng
COPY . .
EXPOSE 4200
CMD ["node", "node_modules/@angular/cli/bin/ng.js", "serve", "--host", "0.0.0.0", "--poll", "2000"]
