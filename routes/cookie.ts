import { Router } from "express";
import { GoTrueApi } from "@supabase/supabase-js";

const routes = Router();

const supabase = new GoTrueApi({
  url: `${process.env.SUPABASE_URL}/auth/v1`,
  headers: {
    Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    apikey: `${process.env.SUPABASE_ANON_KEY}`,
  },
  cookieOptions: {
    name: "sb:token",
    lifetime: 31556952000, // milliseconds in a year
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});

routes.post("/set", (req, res) => {
  supabase.setAuthCookie(req, res);
});

routes.get("/check", (req, res) => {
  if (req.cookies["sb:token"]) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(302);
  }
});

export default routes;
