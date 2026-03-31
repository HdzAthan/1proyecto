const sql = require("mssql");

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "your_password",
  server: "Smitherens\\SQLEXPRESS",
  database: process.env.DB_DATABASE || "YourDatabase",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server: Smitherens\\SQLEXPRESS");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed!", err);
    throw err;
  });

async function queryDatabase(query, params = {}) {
  const pool = await poolPromise;
  const request = pool.request();

  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });

  const result = await request.query(query);
  return result.recordset;
}

module.exports = {
  sql,
  poolPromise,
  queryDatabase,
};
