export type Doc = {
  _id: string;
  title: string;
  type: string;
  savedPath: string;
  description: string;
  tags: string[];
  file: File | undefined;
};
