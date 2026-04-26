import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { FormCard } from "../components/FormCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";

export function Login() {
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState("");
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
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setToast({ message: "Email ou senha inválidos", type: "error" });
      return;
    }
    setToast({ message: "Login realizado!", type: "success" });
    navigate("/home");
  }

  return (
    <AuthLayout>
      <FormCard title="Entrar" subtitle="Acesse sua conta para continuar">
        <form onSubmit={handleLogin} className="form-group">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit">Entrar</Button>
        </form>

        <div className="auth-footer">
          <Button variant="secondary" onClick={() => navigate("/register")}>
            Criar conta
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/forgot-password")}
          >
            Esqueci minha senha
          </Button>
        </div>
      </FormCard>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AuthLayout>
  );
}
