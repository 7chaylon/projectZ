import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
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
  }, []);

  async function handleLogout() {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/");
  }

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Bem-vindo, {user.username}</h1>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}