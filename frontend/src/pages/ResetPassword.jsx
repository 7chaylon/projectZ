import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { FormCard } from "../components/FormCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";

export function ResetPassword() {
  const [toast, setToast] = useState(null);
  const [password, setPassword] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setToast({ message: "Token inválido ou expirado", type: "error" });
      return;
    }

    setToast({ message: "Senha redefinida com sucesso!", type: "success" });

    setTimeout(() => {
      navigate("/");
    }, 700);
  }

  return (
    <AuthLayout>
      <FormCard title="Nova senha" subtitle="Crie uma nova senha de acesso">
        <form onSubmit={handleSubmit} className="form-group">
          <Input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit">Salvar nova senha</Button>
        </form>
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