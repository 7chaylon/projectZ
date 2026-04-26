import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { FormCard } from "../components/FormCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";

export function Register() {
  const [toast, setToast] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      setToast({ message: "Erro ao cadastrar usuário", type: "error" });
      return;
    }

    setToast({ message: "Usuário cadastrado com sucesso!", type: "success" });

    setTimeout(() => {
      navigate("/");
    }, 700);
  }

  return (
    <AuthLayout>
      <FormCard title="Criar conta" subtitle="Preencha seus dados">
        <form onSubmit={handleRegister} className="form-group">
          <Input
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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

          <Button type="submit">Cadastrar</Button>
        </form>

        <div className="auth-footer">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Já tenho conta
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