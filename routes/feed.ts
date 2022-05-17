import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const routes = Router();

routes.get("/get", async (req, res) => {
  const { page } = req.query;

  // We check if the page queries a number or not if its something else we return an error
  if (typeof parseInt(page as string) !== "number") return res.status(400);

  // For now we are just taking queries upto only 100 pages
  if (Number(page) * 10 > 100) return res.status(400);

  const feed = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: Number(page) * 10,
    take: 10,
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
  return res.json(feed);
});

export default routes;
