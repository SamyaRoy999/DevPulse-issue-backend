export const role = ["contributor ", "maintainer"];

type role = (typeof role)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: role;
  createdAt: Date;
  updateAt: Date;
};
