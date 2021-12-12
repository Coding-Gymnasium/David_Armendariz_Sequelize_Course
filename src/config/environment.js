export default {
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || '282d838319a822fbe4b2314a59c511eab0b151ccf52912ea24ff6875fcd1a888',
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || '6a886c8fcc7b7f8b9bf44c7065e5e961f4b668fe56f8ca51991051d103c8eba0'
}
