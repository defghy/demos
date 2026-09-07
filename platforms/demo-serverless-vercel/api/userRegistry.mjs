import { listUsers, updateUser } from "./_storage.mjs";

export default async function handler(request, response) {
  if (request.method === "GET") {
    try {
      response.status(200).json(await listUsers());
      return;
    } catch (error) {
      response.status(500).json({
        message: error instanceof Error ? error.message : "Unable to load users",
      });
      return;
    }
  }

  if (request.method !== "PATCH") {
    response.setHeader("Allow", "GET, PATCH");
    response.status(405).json({ message: "Method not allowed" });
    return;
  }

  const input = request.body;
  const userId = Number(input?.userId);
  const userName =
    typeof input?.userName === "string" ? input.userName.trim() : "";
  const age = Number(input?.age);

  if (!Number.isInteger(userId) || userId < 1 || !userName) {
    response.status(400).json({ message: "Invalid user information" });
    return;
  }

  if (!Number.isInteger(age) || age < 0 || age > 150) {
    response.status(400).json({ message: "Age must be between 0 and 150" });
    return;
  }

  try {
    const updatedUser = await updateUser({ userId, userName, age });
    if (!updatedUser) {
      response.status(404).json({ message: "User not found" });
      return;
    }

    response.status(200).json(updatedUser);
  } catch (error) {
    response.status(500).json({
      message: error instanceof Error ? error.message : "Unable to update user",
    });
  }
}
