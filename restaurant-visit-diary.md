Project : restaurant visits diary

# We used

- NPM
- Node.js
- NestJS
- Prisma
- Docker

NB : I would not be able to make work the containerization of Nestjs and Prisma.
I have been just able to containerize postgresql.
So to make the project works :
Docker must installed for use of postgres container.
NodeJS have to be installed localy.

# Install the dependency of app from package.json

navigate with "cd" until to in the folder of the project or a right clic on the project folder and open with PowerShell (if installed).
run the command :
npm install

# How to run the app

1. Launch the conainer of the database with :
   a) Launch Docker app
   b) run the command
   npm run db:dev:restart:windows (for windows OS)
   npm run db:dev:restart:unix (for unix OS)

2. Launch the app with :
   npm run start

3. test the API with Postman or Insomnia.
   http://localhost:3000/auth/signin
   http://localhost:3000/auth/signup

http://localhost:3000/users
http://localhost:3000/users/me

http://localhost:3000/restaurants

http://localhost:3000/visits
http://localhost:3000/visits/restaurant

# How to run the test

1. Stop the app server.
1. npm run db:test:restart:windows or npm run db:test:restart:unix
1. npm run test:e2e:windows or npm run test:e2e:unix
