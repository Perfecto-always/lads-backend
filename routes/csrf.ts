import { Router } from "express";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ CSRFToken: req.csrfToken() });
});

export default routes;
