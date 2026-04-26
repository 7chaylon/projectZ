import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      alert("Erro no login");
      return;
    }

    navigate("/home");
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>

        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
      <button onClick={() => navigate("/Register")}>Criar conta</button>
      <p>Esqueceu sua senha?</p>
      <button onClick={() => navigate("/forgot-password")}>
        Recuperar senha
      </button>
    </div>
  );
}
