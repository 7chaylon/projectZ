import { useState } from "react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      alert("Erro ao enviar email");
      return;
    }

    alert("Email enviado! Verifique sua caixa de entrada.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Recuperar senha</h1>

      <input
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Enviar</button>
    </form>
  );
}