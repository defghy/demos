export const API_PATHS = {
  getUserInfo: "/api/getUserInfo",
  updateUserInfo: "/api/updateUserInfo",
} as const;

export interface UserRecord {
  userId: number;
  userName: string;
  age: number;
  updatedAt: string;
}

/**
 * API: GET /api/getUserInfo
 * Reads the current user registry from the Vercel Function.
 */
export async function getUserInfo(): Promise<UserRecord[]> {
  const response = await fetch(API_PATHS.getUserInfo, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as UserRecord[];
}

/**
 * API: PATCH /api/updateUserInfo
 * Updates the editable fields of one user row.
 */
export async function updateUserInfo(input: {
  userId: number;
  userName: string;
  age: number;
}): Promise<void> {
  const response = await fetch(API_PATHS.updateUserInfo, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: unknown };
    if (typeof payload.message === "string" && payload.message.length > 0) {
      return payload.message;
    }
  } catch {
    return `Request failed with status ${response.status}`;
  }

  return `Request failed with status ${response.status}`;
}
