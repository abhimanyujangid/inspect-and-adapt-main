export type UserRole = "Admin" | "Operator";

export const ROLE_SWITCH_PASSWORD = "baitech2024";

export function verifyRolePassword(input: string): boolean {
  return input === ROLE_SWITCH_PASSWORD;
}
