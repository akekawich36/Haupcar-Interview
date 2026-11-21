try {
  process.loadEnvFile();
} catch {
}

const base = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: "postgres",
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
