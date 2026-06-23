export interface Issue {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface IssueWithReporter extends Omit<Issue, "reporter_id"> {
  reporter: User | null;
}
