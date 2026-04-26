import { useEffect, useState } from "react";

export function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(onClose, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`toast ${visible ? "show" : ""} ${
        leaving ? "hide" : ""
      } ${type}`}
    >
      {message}
    </div>
  );
}