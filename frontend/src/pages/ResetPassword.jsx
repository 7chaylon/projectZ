import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3000/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    if (!res.ok) {
      alert("Token inválido ou expirado");
      return;
    }

    alert("Senha redefinida com sucesso!");
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Nova senha</h1>

      <input
        type="password"
        placeholder="Digite nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}