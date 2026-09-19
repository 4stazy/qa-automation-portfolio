export type NotePayload = {
  title: string;
  description: string;
  category: "Home" | "Work" | "Personal";
  completed: boolean;
};
