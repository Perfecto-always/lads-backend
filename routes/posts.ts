import { Router } from "express";
import { post } from "../functions/validations";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { User } from "../functions/user";
import { supabase } from "../configs/config.supabase";

const routes = Router();

/**
 * This route has nothing to do with the user it is just for testing the route as all the pages under
 * the routes pages are created by the `npm run gen:routes` command.
 */
routes.get("/", (req, res) => {
  res.send("Hello posts");
});

/**
 * Make sure if you want to use any route after /posts/post than that should be before this route
 * otherwise this route will catch all the routes and sometimes you may not even get the error message
 * which means this could be blocking all other `/post/anything` routes.
 */
routes.get("/post/:id", async (req, res) => {
  const post_id = Number(req.params.id);

  if (!post_id) return res.status(400);

  const post = await prisma.post.findFirst({
    where: {
      id: post_id,
    },
    select: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      id: true,
      authorId: true,
      content: true,
      title: true,
      createdAt: true,
    },
  });
  return res.status(200).json(post);
});

/**
 * Gets a specific user posts by id. The id is not directly provided by the client
 * but it needs to be processed from the auth-token got from the client. As you might
 * have guessed the user needs to be logged in inorder to get the posts.
 *
 * The auth token is set by supabase and the id is contained in the user_metadata
 * You can learn more about it from here:
 * https://supabase.com/docs/learn/auth-deep-dive/auth-deep-dive-jwts#what-are-json-web-tokens-jwts
 */
routes.get("/get", async (req, res) => {
  const id = await User(req);

  if (!id) return res.status(401).send("Unauthorized");

  const posts = await prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          authorId: true,
          content: true,
          title: true,
          createdAt: true,
        },
      },
    },
  });

  // const posts = await prisma.post.findMany({
  //   where: { authorId: id },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   select: {
  //     author: {
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //     id: true,
  //     authorId: true,
  //     content: true,
  //     title: true,
  //     createdAt: true,
  //   },
  // });
  res.json(posts);
});

routes.post("/create", async (req, res) => {
  // Checks for the token to extact id from it
  const token = req.cookies["sb:token"];
  const { user, error } = await supabase.auth.api.getUser(token);

  // If not present returns 401 with error message
  if (error) return res.status(401).json({ error });

  // This gets us the user id which was provided from the login/register
  const id: number = user?.user_metadata?.user_id;

  // This is the data from client side
  const { content, title }: { content: string; title: string } = req.body;

  // This is the serilization of the data
  const validation = post({ id, content, title });

  // This provides us with the error message if any
  const input_error = validation.error?.details[0].message;

  // If there is an error, returns 400 with error message
  if (input_error) return res.status(400).send(error);

  // If the id is in string for,at it converts it into number
  const author_id = Number(id);

  // Finally we send the data to the database
  // and also provide it with the author id and updatedAt (bear in mind that it might vary with the time of
  // createdAt)
  await prisma.post.create({
    data: {
      authorId: author_id,
      content,
      title,
      updatedAt: new Date(),
    },
  });

  return res.json({ message: "Post created successfully" });
});

export default routes;
