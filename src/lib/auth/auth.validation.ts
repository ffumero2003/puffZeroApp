// src/lib/auth/auth.validation.ts

/* ---------------------------
   EMAIL
----------------------------*/
export function validateEmail(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "Este campo es obligatorio.";
  if (/\s/.test(trimmed)) return "El correo no puede tener espacios.";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(trimmed)) return "Correo inválido.";

  return "";
}

/* ---------------------------
   PASSWORD
----------------------------*/
export function validatePassword(value: string): string {
  if (!value.trim()) return "Este campo es obligatorio.";
  if (/\s/.test(value)) return "La contraseña no puede contener espacios.";
  if (value.length < 6) return "Mínimo 6 caracteres.";
  if (!/[0-9]/.test(value)) return "Debe incluir al menos un número.";
  if (!/[A-Za-z]/.test(value)) return "Debe incluir al menos una letra.";

  return "";
}

/* ---------------------------
   CONFIRM PASSWORD
----------------------------*/
export function validateConfirmPassword(
  password: string,
  confirm: string
): string {
  if (!confirm.trim()) return "Este campo es obligatorio.";
  if (password !== confirm) return "Las contraseñas no coinciden.";
  return "";
}

/* ---------------------------
   FULL NAME
----------------------------*/
export function validateFullName(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "Este campo es obligatorio.";
  if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(trimmed))
    return "Solo se permiten letras.";

  const partes = trimmed.split(" ");
  if (partes.length < 2)
    return "Incluí nombre y apellido.";

  if (partes.some((p) => p.length < 2))
    return "Cada nombre/apellido debe tener al menos 2 letras.";

  return "";
}
