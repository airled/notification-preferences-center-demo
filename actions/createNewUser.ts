import { createUser, type UserData } from "@/services/createUser";
import { redirect } from "next/navigation";

export async function createNewUser(formData: FormData) {
  "use server";

  const userData = Object.fromEntries(formData) as unknown as UserData;

  const user = await createUser(userData)
  redirect(`/users/${user.id}`) 
}
