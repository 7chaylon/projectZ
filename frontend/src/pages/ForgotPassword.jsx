import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { FormCard } from "../components/FormCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";

export function ForgotPassword() {
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

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
      setToast({ message: "Erro ao enviar email", type: "error" });
      return;
    }

    setToast({
      message: "Email enviado! Verifique sua caixa de entrada.",
      type: "success",
    });
  }

  return (
    <AuthLayout>
      <FormCard
        title="Recuperar senha"
        subtitle="Informe seu email para receber o link"
      >
        <form onSubmit={handleSubmit} className="form-group">
          <Input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit">Enviar link</Button>
        </form>

        <div className="auth-footer">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Voltar para login
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