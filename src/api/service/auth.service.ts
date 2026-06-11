import { sql } from "../../db";
import { User } from "../../types";
import bcrypt from "bcrypt";

class authService {
  async createUser(user: User) {
    const { name, email, password, role } = user;
    const hash = await bcrypt.hash(password, 10);

    const res = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (
        ${name},
        ${email},
        ${hash},
        COALESCE(${role}, 'contributor') 
      )
      RETURNING id, name, email, role, created_at, updated_at
    `;

    return res[0];
  }
  async ValidateUser(
    email: string,
    passwordInput: string,
  ): Promise<Omit<User, "password"> | null> {
    const res = await sql`
      SELECT id, name, email, password, role FROM users WHERE email = ${email}
    `;
    if (!res.length) {
      return null;
    }
    const { password: passwordHash, ...user } = res[0] as User;
    const isValid = await bcrypt.compare(passwordInput, passwordHash);
    return isValid ? user : null;
  }
}

export default new authService();
