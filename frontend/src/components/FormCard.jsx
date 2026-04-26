export function FormCard({ title, subtitle, children }) {
  return (
    <section className="auth-card">
      <h1 className="auth-title">{title}</h1>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}