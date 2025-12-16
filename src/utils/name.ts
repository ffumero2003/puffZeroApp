export function getFirstName(fullName?: string | null) {
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
}
