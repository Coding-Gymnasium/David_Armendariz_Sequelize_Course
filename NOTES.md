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
