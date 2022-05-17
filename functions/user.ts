import { Request } from "express";
import { supabase } from "../configs/config.supabase";

export async function User(req: Request): Promise<number | undefined> {
  if (!req.headers.authorization) return undefined;
  const auth_cookie = JSON.parse(req.headers.authorization);
  const token = auth_cookie["sb:token"];

  const { user } = await supabase.auth.api.getUser(token);
  const id: number = user?.user_metadata?.user_id;

  return id;
}
