export function validateName(name: string): boolean {
  if (!name) return false;
  const nameRegex = /[a-zA-Z] [a-zA-Z]+/;
  return nameRegex.test(name);
}
