export function Button({ variant = "primary", children, ...props }) {
  return (
    <button
      className={`button ${variant === "secondary" ? "secondary" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}