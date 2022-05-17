import bycrypt from "bcrypt";

interface Options {
  saltRounds?: number;
}

export function hashedPassword(password: string, options?: Options) {
  const salt = options?.saltRounds || 13;
  if (!password) return null;
  else {
    const hased = bycrypt.hash(password, salt);
    return hased;
  }
}
