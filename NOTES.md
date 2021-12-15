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
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
```

7.Configure Jest
`$ touch jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
};
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
      - ${DB_TEST_PORT:-5434}:5432
```

Run

`docker-compose up -d`

10.Create database

Login as user postgres
This user already has permissions to create a database

Create database
`postgres=# CREATE DATABASE sequelize_course_db OWNER postgres;`
`postgres=# CREATE DATABASE sequelize_course_test_db OWNER postgres;`

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
  },
  test: {
    username: process.env.DB_TEST_USERNAME || 'postgres',
    password: process.env.DB_TEST_PASSWORD || 'postgres',
    host: process.env.DB_TEST_HOST || 'localhost',
    port: parseInt(process.env.DB_TEST_PORT) || 8765,
    database: process.env.DB_TEST_DATABASE || 'postgres',
    dialect: 'postgres',
  },
};
```

3.Create 'environment'

```javascript
export default {
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
  jwtAccessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    '282d838319a822fbe4b2314a59c511eab0b151ccf52912ea24ff6875fcd1a888',
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ||
    '6a886c8fcc7b7f8b9bf44c7065e5e961f4b668fe56f8ca51991051d103c8eba0',
};
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
import environment from '../config/environment';

export default class JWTUtils {
  static generateAccessToken(payload, options = {}) {
    const { expiresIn = '1d' } = options;
    return jwt.sign(payload, environment.jwtAccessTokenSecret, { expiresIn });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, environment.jwtRefreshTokenSecret);
  }

  static verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, environment.jwtAccessTokenSecret);
  }

  static verifyRefreshToken(accessToken) {
    return jwt.verify(accessToken, environment.jwtRefreshTokenSecret);
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
    const payload = { email: 'test@example.com' };
    expect(JWTUtils.generateAccessToken(payload)).toEqual(expect.any(String));
  });

  it('should return and refresh toke', () => {
    const payload = { email: 'test@example.com' };
    expect(JWTUtils.generateRefreshToken(payload)).toEqual(expect.any(String));
  });

  it('should verify that the access token is valid', () => {
    const payload = { email: 'test@example.com' };
    const jwt = JWTUtils.generateAccessToken(payload);
    expect(JWTUtils.verifyAccessToken(jwt)).toEqual(
      expect.objectContaining(payload),
    );
  });

  it('should verify that the refresh token is valid', () => {
    const payload = { email: 'test@example.com' };
    const jwt = JWTUtils.generateRefreshToken(payload);
    expect(JWTUtils.verifyRefreshToken(jwt)).toEqual(
      expect.objectContaining(payload),
    );
  });

  it('should error if the access token is invalid', () => {
    expect(() => JWTUtils.verifyAccessToken('invalid token')).toThrow(
      JsonWebTokenError,
    );
  });

  it('should error if the refresh token is invalid', () => {
    expect(() => JWTUtils.verifyRefreshToken('invalid token')).toThrow(
      JsonWebTokenError,
    );
  });
});
```

Run tests
`npm run test:watch`

## Connect to the database

- Create a database directory
- Create 'index.js'

```javascript
import cls from "cls-hooked";
import {Sequelize} from "sequelize/dist";
import {registerModels} from "../models";

export default class Database {
  constructor(environment, dbConfig) {
    this.environment = environment;
    this.dbConfig = dbConfig;
    this.isTestEnviroment = this.environment === 'test';

  }
  async connect() {
    // set up namespace for transactions
    const namespace = cls.createNamespace('transactions namespace');
    Sequelize.useCLS(namespace);

    // Create the connection
    const {username, password, host, port, database, dialect} = this.dbConfig(this.environment)
    this.connection = new Sequelize({ username, password, host, port, database, dialect, logging: this.isTestEnviroment ? false : console.log })
    <!-- Check if we connected succesfully -->
    await this.connection.authenticate({ logging: false });
    if(this.isTestEnviroment){
      console.log('Connection to the database has been established successfully');
    }

    // Register the models
    registerModels(this.connection);

    // Sync the models
    await this.sync();
  }

  async disconnect() {
    await this.connection.close();
  }

  async sync() {
    await this.connection.sync(
      {
        logging: false,
        force: this.isTestEnviroment,
      }
    );

    if (!this.isTestEnviroment) {
      console.log('Connection synced successfully');
    }
  }
}
```

## Create models index.js and import models to database index

- Create 'models' directory
- Create 'index.js'

```javascript
import fs from 'fs';
import path from 'path';

let models = {};

export function registerModels(sequelize) {
  const thisFile = path.basename(__filename); // index.js
  const modelFiles = fs.readdirSync(__dirname);
  const filteredModelFiles = modelFiles.filter(( file ) => {
    return file !== thisFile && file.slice(-3) === '.js';
  })

  for(const file of filteredModelFiles) {
    const model = require(path.join(_dirname, file)).default(sequelize);
    models(model.name) = model;
  }

  Object.keys(models).forEach((modelName) => {
    if(models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
}

export default models;
```

## Create 'server.js' in src

```javascript
import './config';
import Database from './database';
import environment from './config/environment';
import dbConfig from './config/database';

// IIFE = Immediately invoked Function Expression
(async () => {
  try {
    const db = new Database(environment.nodeEnv, dbConfig);
    await db.connect();
  } catch (err) {
    console.error(
      'Something went wrong when initializing the server:\n',
      err.stack,
    );
  }
})();
```

Create tests helpers

touch 'tests-helpers.js'

```javascript
import '../src/config';
import Database from '../src/database';
import dbConfig from '../src/config/database';

let db;

export default class TestHelpers {
  static async startDb() {
    db = new Database('test', dbConfig);
    await db.connect();
    return db;
  }

  static async stopDb() {
    await db.disconnect();
  }

  static async syncDb() {
    await db.sync();
  }
}
```

Create models

- User
- Refresh Token
- Roles

User Model

1. User will have many roles
2. User will have one refresh token
3. Properties
   - email (string)
   - password (string)
   - username (string)
   - fistName (string)
   - lastName (string)

Role Model

1. Belongs to a User
2. Properties
   - role (string)

Refresh Token Model

1. Refresh Token belongs to a User
2. Properties
   - token(string)

Create User model

- touch src/models/user.js

```javascript
import { Model, DataTypes } from 'sequelize/dist';
import bcrypt from 'bcrypt';

import environment from '../config/environment';

export default sequelize => {
  class User extends Model {
    static associate(models) {
      User.RefreshToken = User.hasOne(models.RefreshToken);
      User.Roles = User.hasMany(models.Role);
    }

    static async hashPassword(password) {
      return bcrypt.hash(password, environment.saltRounds);
    }

    static async createNewUser({
      email,
      password,
      roles,
      username,
      firstName,
      lastName,
      refreshToken,
    }) {
      return sequelize.transaction(async () => {
        let rolesToSave = [];

        if (roles && Array.isArray(roles)) {
          rolesToSave = roles.map(role => ({ role }));
        }

        await User.create(
          {
            email,
            password,
            username,
            firstName,
            lastName,
            RefreshToken: { token: refreshToken },
            Roles: rolesToSave,
          },
          { include: [User.RefreshToken, User.Roles] },
        );
      });
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Not a valid email address',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        validate: {
          len: {
            args: [2, 50],
            msg: 'Username must contain between 2 and 50 characters',
          },
        },
      },
      firstName: {
        type: DataTypes.STRING(50),
        validate: {
          len: {
            args: [3, 50],
            msg: 'First name must contain between 2 and 50 characters',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        validate: {
          len: {
            args: [3, 50],
            msg: 'Last name must contain between 3 and 50 characters',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
      },
    },
  );

  // Instance methods

  User.prototype.comparePasswords = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Hooks

  User.beforeSave(async (user, options) => {
    const hashedPassword = await User.hashPassword(user.password);
    user.password = hashedPassword;
  });

  return User;
};
```

