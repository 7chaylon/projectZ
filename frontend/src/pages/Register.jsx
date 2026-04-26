import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // 👈 NOVO
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email, // 👈 NOVO
        password,
      }),
    });

    if (!res.ok) {
      alert("Erro ao cadastrar");
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    navigate("/");
  }

  return (
    <form onSubmit={handleRegister}>
      <h1>Cadastro</h1>

      <input
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* 👇 NOVO CAMPO */}
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Cadastrar</button>

      <button type="button" onClick={() => navigate("/")}>
        Já tenho conta
      </button>
    </form>
  );
}