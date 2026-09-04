import { db } from "../lib/cloudbase";

export const API_PATHS = {
  getUserInfo: "/getUserInfo",
  updateUserInfo: "/updateUserInfo",
} as const;

export interface UserRecord {
  userId: number;
  userName: string;
  age: number;
  updatedAt: string;
}

interface UserRow {
  user_id: number;
  user_name: string;
  age: number;
  updated_at: string;
}

function isUserRow(value: unknown): value is UserRow {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const row = value as Record<string, unknown>;
  return (
    typeof row.user_id === "number" &&
    typeof row.user_name === "string" &&
    typeof row.age === "number" &&
    typeof row.updated_at === "string"
  );
}

function toUserRecord(row: UserRow): UserRecord {
  return {
    userId: row.user_id,
    userName: row.user_name,
    age: row.age,
    updatedAt: row.updated_at,
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return "CloudBase request failed";
}

/**
 * API: GET /getUserInfo
 * Reads the current user registry from CloudBase PG.
 */
export async function getUserInfo(): Promise<UserRecord[]> {
  const response = await db
    .from("users")
    .select("user_id,user_name,age,updated_at")
    .order("user_id", { ascending: true });

  if (response.error) {
    throw new Error(getErrorMessage(response.error));
  }

  const rows: unknown[] = Array.isArray(response.data) ? response.data : [];
  return rows.filter(isUserRow).map(toUserRecord);
}

/**
 * API: PATCH /updateUserInfo
 * Updates the editable fields of one user row.
 */
export async function updateUserInfo(input: {
  userId: number;
  userName: string;
  age: number;
}): Promise<void> {
  const response = await db
    .from("users")
    .update({
      user_name: input.userName,
      age: input.age,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", input.userId);

  if (response.error) {
    throw new Error(getErrorMessage(response.error));
  }
}
