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

  async getAllIssues(filters: {
    sort?: string;
    type?: string;
    status?: string;
  }) {
    const res = await sql`
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at 
    FROM issues
    ORDER BY created_at DESC
  `;

    let result = [...res];

    // sort filter
    if (filters.sort === "oldest") {
      result.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }

    // type filter
    if (filters.type) {
      result = result.filter((issue: any) => issue.type === filters.type);
    }

    // status filter
    if (filters.status) {
      result = result.filter((issue: any) => issue.status === filters.status);
    }

    return result;
  }
  async getIssueById(id: number) {
    const res = await sql`
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at 
    FROM issues 
    WHERE id = ${id}
  `;
    return res[0] || null;
  }
  async updateIssue(
    id: number,
    data: { title?: string; description?: string; type?: string },
  ) {
    const { title, description, type } = data;

    const res = await sql`
    UPDATE issues
    SET
      title = COALESCE(${title ?? null}, title),
      description = COALESCE(${description ?? null}, description),
      type = COALESCE(${type ?? null}, type),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

    return res[0] || null;
  }

  async deleteIssue(id: number) {
    await sql`DELETE FROM issues WHERE id = ${id}`;
  }
}

export default new IssueService();
