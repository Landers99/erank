import express from "express";
import cors from "cors";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Users
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

app.post("/users", async (req, res) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const user = await prisma.user.create({ data: parsed.data });
  res.json(user);
});

// Todos
const todoSchema = z.object({
  title: z.string().min(1),
  userId: z.string().min(1),
});

app.post("/todos", async (req, res) => {
  const parsed = todoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const todo = await prisma.todo.create({ data: parsed.data });
  res.json(todo);
});

app.get("/todos/:userId", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.params.userId },
  });
  res.json(todos);
});

app.patch("/todos/:id", async (req, res) => {
  const todo = await prisma.todo.update({
    where: { id: req.params.id },
    data: { done: true },
  });
  res.json(todo);
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => console.log(`API on :${port}`));
