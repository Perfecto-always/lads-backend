import Joi from "joi";

export function register({
  username,
  password,
  email,
}: {
  username: string;
  email: string;
  password: string;
}) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(128).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  });

  return schema.validate({ username, email, password });
}

export function login({ email }: { email: string }) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate({ email });
}

export function post({
  id,
  content,
  title,
}: {
  id: number | undefined;
  content: string;
  title: string;
}) {
  const schema = Joi.object({
    id: Joi.number().required(),
    content: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
  });
  return schema.validate({ id, content, title });
}
