import { Pool } from "pg";

const postgresUrl = process.env.POSTGRES_URL;
const globalStore = globalThis;

const seedRows = [
  {
    userId: 1,
    userName: "Alice",
    age: 28,
    updatedAt: new Date(0).toISOString(),
  },
  {
    userId: 2,
    userName: "Bob",
    age: 34,
    updatedAt: new Date(0).toISOString(),
  },
  {
    userId: 3,
    userName: "Charlie",
    age: 41,
    updatedAt: new Date(0).toISOString(),
  },
];

let pool = null;

export async function listUsers() {
  if (!postgresUrl) {
    globalStore.userRegistryRows ??= structuredClone(seedRows);
    return [...globalStore.userRegistryRows].sort((a, b) => a.userId - b.userId);
  }

  const result = await withClient(async (client) => {
    const query = await client.query(
      "SELECT user_id, user_name, age, updated_at FROM users ORDER BY user_id ASC",
    );
    return query.rows.map((row) => toUserRow(row));
  });

  return result;
}

export async function updateUser(input) {
  if (!postgresUrl) {
    globalStore.userRegistryRows ??= structuredClone(seedRows);
    const existing = globalStore.userRegistryRows.find(
      (row) => row.userId === input.userId,
    );
    if (!existing) {
      return null;
    }

    existing.userName = input.userName;
    existing.age = input.age;
    existing.updatedAt = new Date().toISOString();
    return { ...existing };
  }

  return withClient(async (client) => {
    const query = await client.query(
      `UPDATE users
       SET user_name = $2, age = $3, updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id, user_name, age, updated_at`,
      [input.userId, input.userName, input.age],
    );
    return query.rows[0] ? toUserRow(query.rows[0]) : null;
  });
}

async function withClient(operation) {
  pool ??= new Pool({ connectionString: postgresUrl, max: 5 });

  const client = await pool.connect();
  try {
    return await operation(client);
  } finally {
    client.release();
  }
}

function toUserRow(row) {
  return {
    userId: Number(row.user_id),
    userName: String(row.user_name),
    age: Number(row.age),
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : String(row.updated_at),
  };
}
