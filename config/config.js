require('dotenv').config()

const {
  PG_HOST,
  PG_USER,
  PG_PASS,
  PG_PORT,
  PG_DB_NAME
} = process.env

module.exports = {
  "development": {
    "username": PG_USER,
    "password": PG_PASS,
    "database": PG_DB_NAME,
    "host": PG_HOST,
    "dialect": "postgres",
    "port": PG_PORT
  },
  "test": {
    "username": PG_USER,
    "password": PG_PASS,
    "database": PG_DB_NAME,
    "host": PG_HOST,
    "dialect": "postgres",
    "port": PG_PORT
  },
  "production": {
    "username": PG_USER,
    "password": PG_PASS,
    "database": PG_DB_NAME,
    "host": PG_HOST,
    "dialect": "postgres",
    "port": PG_PORT,
    "use_env_variable": 'DATABASE_URL',
    "dialectOptions": {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  }
}
