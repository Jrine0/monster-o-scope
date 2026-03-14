import { apiClient } from "@/lib/api-client";

export async function fetchClasses(page = 1) {
  const res = await apiClient.get("/v1/admin/classes", {
    params: { page },
  });
  return res.data;
}

export async function createClass(data: {
  name: string;
  grade: number;
  subject: string;
  teacher_id?: string | null;
}) {
  const res = await apiClient.post("/v1/admin/classes", data);
  return res.data;
}