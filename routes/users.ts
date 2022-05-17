import { Router } from "express";
const routes = Router();
import { register, login } from "../functions/validations";
import { PrismaClient } from "@prisma/client";
import { supabase } from "../configs/config.supabase";
import { createClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";
const prisma = new PrismaClient();

routes.get("/", (req, res) => {
  res.send("Hello new users");
});

// This is a Sign up/ Register route which creates a new user.
// Creates a new user needs two params from the body of the request.
routes.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;
  const schema = register({ username, email, password });
  /**
   * This is a validation function that checks if the user input is valid.
   * this error is a validation error
   */
  const error_ = schema.error?.details[0].message;

  if (error_) return res.status(400).json({ error: error_ });

  /**
   * We need to make sure that their is only one of username and email address
   * that is unique in the database. If we find either of them (name or email)
   * we return the process then and there with a message.
   */
  const userData = await prisma.user.findFirst({
    where: { OR: [{ email }, { name: username }] },
  });

  /**
   * If the userData is presend then we return a message to the user.
   * and if not:
   * - than we create a new user in the database. (Currently using planetscale).
   * - than we create a new user in the database. (Currently using supabase).
   * - if we are successful than we send success message else error.
   */
  if (userData) return res.status(400).json({ error: "User already exists" });

  const id = await prisma.user
    .create({
      data: {
        name: username,
        email: email,
      },
    })
    .then((res) => {
      return res.id;
    })
    .catch(() => {
      res.status(400).json({ error: "Server Error" });
    });

  const { user, error } = await supabase.auth.signUp(
    {
      email: email,
      password: password,
    },
    {
      data: {
        user_id: id,
      },
    }
  );

  if (error) return res.status(400).json({ error: "Server Error" });

  if (user)
    return res.json({
      message: "Please check your email to verify your account",
    });
});

/**
 * This is a Login route which logs in a user.
 * Checks whether the user exists and if the password is correct.
 * We are not saving the password in our database (planetscale),
 * rather we are relying on supabase for authentication.
 * We only need email from the user as supabas sends magic links
 * if we only provide email.
 * @param {string} email
 *
 * For more info read here:
 * https://supabase.com/docs/guides/auth/auth-magic-link
 *  */
routes.post("/login", async (req, res) => {
  const { email }: { email: string } = req.body;

  /**
   * Refer to the functions/validations for more info what are we doing.
   */
  const schema = login({ email });
  const error_ = schema.error?.details[0].message;

  if (error_) return res.status(400).send(error_);

  /**
   * As we are not using any username for login so we make sure that we are checking
   * that we have email in the database or not.
   */
  const email_exists = await prisma.user.findUnique({
    where: { email },
  });

  if (!email_exists)
    return res.status(400).json({ error: "User does not exist" });

  const { error } = await supabase.auth.signIn({
    email,
  });

  if (error) return res.status(401).json({ error: error.message });

  return res.status(200).json({ message: "Please check your email" });
});

/**
 * This method is yet to be implemented becuase
 *
 * `logged_out` field is never changed it is just using the default value
 *
 * We also need to make sure that supabase also clears the cookie that it sets
 * at the time of loggin/signin in.
 *
 */

routes.put("/logout", async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "No user id provided" });

  await prisma.user
    .update({
      where: { id: id },
      data: {
        logged_out: true,
      },
    })
    .then(() => {
      return res.json({ message: "Logged out successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ error: "Server Error" });
    });
});

/**
 * This is a better way to create user on supabase as this provides some what
 * control of how to create a user and with what data.
 * Though this is not different than the previous method
 * as in its outcome but still this feels secure.
 */

// routes.post("/supabase/login", async (req, res) => {
//   invariant(process.env.SUPABASE_URL, "Add supabase url in env variable");
//   invariant(
//     process.env.SUPABASE_SERVICE_ROLE_KEY,
//     "Add supabase service role key in env variable"
//   );
//   const supbaseAdmin = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_SERVICE_ROLE_KEY
//   );

//   const { data, error, user } = await supbaseAdmin.auth.api.createUser({
//     email: "",
//     password: "idontknow",
//     data: { name: "Perfecto" },
//   });

//   res.status(200).json({
//     data,
//     user,
//     error,
//   });
// });

export default routes;
