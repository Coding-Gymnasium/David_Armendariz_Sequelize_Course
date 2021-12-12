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
    "test": "jest --runInBand",
    "test:watch": "npm test -- --watch",
    "testcoverage": "npm test -- --coverage"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.0.1",
    "cls-hooked": "^4.2.2",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "morgan": "^1.10.0",
    "pg": "^8.7.1",
    "sequelize": "^6.12.0-beta.2",
    "sequelize-cli": "^6.3.0"
  },
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

## Create config directory

1.Create 'index.js'

```javascript
  import dotenv from 'dotenv';

  dotenv.config();
```

2.Create 'database.js'

```javascript
module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 9876,
    database: process.env.DB_DATABASE || 'postgres',
    dialect: 'postgres',
  }, test: {
    username: process.env.DB_TEST_USERNAME || 'postgres',
    password: process.env.DB_TEST_PASSWORD || 'postgres',
    host: process.env.DB_TEST_HOST || 'localhost',
    port: parseInt(process.env.DB_TEST_PORT) || 8765,
    database: process.env.DB_TEST_DATABASE || 'postgres',
    dialect: 'postgres',
  },
}
```

3.Create 'environment'

```javascript
export default {
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || '282d838319a822fbe4b2314a59c511eab0b151ccf52912ea24ff6875fcd1a888',
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || '6a886c8fcc7b7f8b9bf44c7065e5e961f4b668fe56f8ca51991051d103c8eba0'
}
```

To create a randomized string use crypto in Node (terminal)

`$ node`
`> require('crypto')`
`> crypto.randomBytes(32).toString('hex')` // this will create a rondomized 32 bytes using hex decimal
example output:'282d838319a822fbe4b2314a59c511eab0b151ccf52912ea24ff6875fcd1a888'

## Create JWT utils file

- Create 'utils' in the src directory
- Touch 'jwt-utils.js'

```javascript
import jwt from 'jsonwebtoken';
import environment from '../config/environment'

export default class JWTUtils {
  static generateAccessToken(payload, options = {}) {
    const { expiresIn = '1d' } = options;
    return jwt.sign(payload, environment.jwtAccessTokenSecret, {expiresIn});
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, environment.jwtRefreshTokenSecret);
  }

  static verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, environment.jwtAccessTokenSecret)
  }

  static verifyRefreshToken(accessToken) {
    return jwt.verify(accessToken, environment.jwtRefreshTokenSecret)
  }
}
```


## Create Tests Directory

- Create directory 'tests' in root
- Create directory 'utils' in 'tests'
- Create test file 'jwt-utils.test.js'

```javascript
import jwt from 'jsonwebtoken';
import JWTUtils from '../../src/utils/jwt-utils';

describe('jwt utils', () => {
  it('should return and access toke', () => {
    const payload = {email: 'test@example.com'} 
    expect(JWTUtils.generateAccessToken( payload )).toEqual(expect.any(String));
  }); 

  it('should return and refresh toke', () => {
    const payload = {email: 'test@example.com'} 
    expect(JWTUtils.generateRefreshToken( payload )).toEqual(expect.any(String));
  }); 

   it('should verify that the access token is valid', () => {
   const payload = {email: 'test@example.com'} 
    const jwt = JWTUtils.generateAccessToken(payload)  
    expect(JWTUtils.verifyAccessToken(jwt)).toEqual(expect.objectContaining(payload))
  });

  it('should verify that the refresh token is valid', () => {
   const payload = {email: 'test@example.com'} 
    const jwt = JWTUtils.generateRefreshToken(payload)  
    expect(JWTUtils.verifyRefreshToken(jwt)).toEqual(expect.objectContaining(payload))
  });

  it('should error if the access token is invalid', () => {
    expect(() => JWTUtils.verifyAccessToken('invalid token')).toThrow(JsonWebTokenError); 
  });

  it('should error if the refresh token is invalid', () => {
    expect(() => JWTUtils.verifyRefreshToken('invalid token')).toThrow(JsonWebTokenError); 
  });
});
```

Run tests
`npm run test:watch`

