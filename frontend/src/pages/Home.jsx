import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";

export function Home() {
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const res = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });

      if (!res.ok) {
        navigate("/");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    }

    checkSession();
  }, [navigate]);

  async function handleLogout() {
    const res = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      setToast({ message: "Erro ao sair da conta", type: "error" });
      return;
    }

    setToast({ message: "Logout realizado com sucesso!", type: "success" });

    setTimeout(() => {
      navigate("/");
    }, 700);
  }

  if (!user) return <p>Carregando...</p>;

  return (
    <main className="home-page">
      <section className="home-card">
        <h1>Dashboard</h1>

        <p>
          Bem-vindo, <strong>{user.username}</strong>.
        </p>

        <p>Email: {user.email}</p>

        <Button onClick={handleLogout}>Sair</Button>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}