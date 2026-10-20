import pg from 'pg'

pg.types.setTypeParser(20, (value) => parseInt(value, 10));

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false},
})

export default pool;