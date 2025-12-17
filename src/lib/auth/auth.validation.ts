// src/lib/auth/auth.validation.ts

/* ---------------------------
   EMAIL (2025 REAL)
----------------------------*/
export function validateEmail(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "Este campo es obligatorio.";

  // validación mínima realista
  if (!trimmed.includes("@")) return "Correo inválido.";
  const [, domain] = trimmed.split("@");
  if (!domain || !domain.includes(".")) return "Correo inválido.";

  // NO más regex complejos
  return "";
}

/* ---------------------------
   PASSWORD (NIST / OWASP 2025)
----------------------------*/
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 64;

const COMMON_PASSWORDS = new Set([
  "123456",
  "12345678",
  "password",
  "admin",
  "qwerty",
  "111111",
  "000000",
]);

export function validatePassword(value: string): string {
  if (!value) return "Este campo es obligatorio.";

  if (value.length < MIN_PASSWORD_LENGTH)
    return `Usá al menos ${MIN_PASSWORD_LENGTH} caracteres.`;

  if (value.length > MAX_PASSWORD_LENGTH)
    return `Máximo ${MAX_PASSWORD_LENGTH} caracteres.`;

  const normalized = value.trim().toLowerCase();
  if (COMMON_PASSWORDS.has(normalized))
    return "Esa contraseña es demasiado común.";

  // permitir espacios, unicode, emojis
  if (value.trim().length === 0)
    return "La contraseña no puede ser solo espacios.";

  return "";
}

/* ---------------------------
   CONFIRM PASSWORD
----------------------------*/
export function validateConfirmPassword(
  password: string,
  confirm: string
): string {
  if (!confirm) return "Confirmá tu contraseña.";
  if (password !== confirm) return "Las contraseñas no coinciden.";
  return "";
}

/* ---------------------------
   FULL NAME (INCLUSIVO 2025)
----------------------------*/
export function validateFullName(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "Este campo es obligatorio.";

  // Longitud flexible
  if (trimmed.length < 2)
    return "El nombre es demasiado corto.";

  if (trimmed.length > 70)
    return "El nombre es demasiado largo.";

  // Permitir letras unicode, espacios, guiones y apóstrofes
  // Bloquear SOLO números y símbolos obvios
  const invalidChars = /[0-9!@#$%^&*()_+=\[\]{};:"\\|<>/?]/;
  if (invalidChars.test(trimmed))
    return "El nombre contiene caracteres inválidos.";

  return "";
}
