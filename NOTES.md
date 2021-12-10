# Sequelize course

1. npm init -y
2. touch .prettierrc

```prettierrc
{
  'trailingComma': 'ES5',
  'semi': true,
  'singleQuote': true,
  'quoteProps': 'consistent',
  'printWidth': 80,
  'tabWidth': 2
}

```

3.touch .gitignore

```gitignore
  # Node Modules
  
  /node_modules
  
  # Coverage
  
  /coverage
  
  # Environment Variables
  .env
  
  /dist

```

4.Install dependencies:
`$ npm install bcrypt sequelize sequelize-cli jsonwebtoken pg express dotenv morgan cls-hooked`

5.Install development dependencies
  `$ npm install -D @babel/cli @babel/core @babel/node @babel/preset-env jest @types/jest supertest nodemon`

6.Configure Babel
  `$ touch babel.config.js`

  ```javascript
    module.exports = {
      presets: [
        ['@babel/preset-env', 
          {targets: {node: 'current'}}
        ]
      ]
    }
  ```

7.Configure Jest
  `$ touch jest.config.js`

  ```javascript
    module.exports = {
      testEnvironment: 'node'
    }
  ```

8.Setup scripts in package.json

```json
{
  "name": "sequelize-course",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "babel ./src --out-dir ./dist",
    "start": "node dist/server.js",
    "dev": "NODE_ENV=development nodemon --exec babel-node src/server.js",
    "debug": "npm run dev -- --inspect",
    "test": "jest --runinBand",
    "testwatch": "npm test -- --watch",
    "testcoverage": "npm test -- --coverage"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.16.0",
    "@babel/core": "^7.16.0",
    "@babel/node": "^7.16.0",
    "@babel/preset-env": "^7.16.4",
    "@types/jest": "^27.0.3",
    "jest": "^27.4.3",
    "nodemon": "^2.0.15",
    "supertest": "^6.1.6"
  }
}
```

9.Docker-compose.yaml file

`$ touch docker-compose.yaml`

```yaml
version: '3'
services:
  postgres:
    image: postgres:13
    container_name: sequelize-course-db
    env_file:
      - .env
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
    ports:
      - ${DB_PORT:-9876}:9876
  postgres-test:
    image: postgres:13
    container_name: sequelize-course-test-db
    env_file:
      - .env
    environment:
      POSTGRES_PASSWORD: ${DB_TEST_PASSWORD:-postgres}
    ports:
      - ${DB_TEST_PORT:-8765}:9876
```

Run

`docker-compose up -d`

10.Create database

Login as user nicorithner
This user already has permissions to create a database

`postgres=# psql -d postgres -U nicorithner`

Create database
`postgres=# CREATE DATABASE sequelize_course;`

Repeat steps to create 'sequelize_course_test'


`postgres=# \list`
