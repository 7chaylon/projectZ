import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5174"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "minha_chave_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Preencha usuário, email e senha",
    });
  }

  const [existing] = await db.query(
    "SELECT id FROM users WHERE username = ? OR email = ?",
    [username, email]
  );

  if (existing.length > 0) {
    return res.status(400).json({
      message: "Usuário ou email já cadastrado",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );

  res.status(201).json({
    message: "Usuário cadastrado",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Preencha email e senha",
    });
  }

  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    return res.status(401).json({
      message: "Email ou senha inválidos",
    });
  }

  const user = users[0];

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({
      message: "Email ou senha inválidos",
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  res.json({
    message: "Login realizado",
    user: req.session.user,
  });
});

app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Não autenticado",
    });
  }

  res.json({
    user: req.session.user,
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");

    res.json({
      message: "Logout realizado",
    });
  });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Informe o email",
    });
  }

  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    return res.status(404).json({
      message: "Email não encontrado",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 15);

  await db.query(
    "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
    [token, expires, email]
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Redefinição de senha",
    html: `
      <h2>Redefinição de senha</h2>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Esse link expira em 15 minutos.</p>
    `,
  });

  res.json({
    message: "Email de redefinição enviado",
  });
});

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Informe a nova senha",
    });
  }

  const [users] = await db.query(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
    [token]
  );

  if (users.length === 0) {
    return res.status(400).json({
      message: "Token inválido ou expirado",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `UPDATE users 
     SET password = ?, reset_token = NULL, reset_token_expires = NULL 
     WHERE id = ?`,
    [hashedPassword, users[0].id]
  );

  res.json({
    message: "Senha redefinida com sucesso",
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});