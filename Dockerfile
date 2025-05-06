FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY prisma ./prisma/
COPY . . 
RUN npx prisma generate
CMD ["yarn", "run", "start:dev"]