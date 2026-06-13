import { sql } from "../../db";

interface CreateIssueInput {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}

class IssueService {
  async createIssue(data: CreateIssueInput) {
    const { title, description, type, reporter_id } = data;

    const res = await sql`
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES (${title}, ${description}, ${type}, ${reporter_id})
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `;

    return res[0];
  }
}

export default new IssueService();
