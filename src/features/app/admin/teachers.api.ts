import { apiClient } from "@/lib/api-client";

export async function fetchTeachers(page = 1, search?: string) {
  const res = await apiClient.get("/v1/admin/teachers", {
    params: {
      page,
      search: search || undefined,
    },
  });

  return res.data;
}

export async function createTeacher(data: {
  first_name: string;
  last_name: string;
  email: string;
}) {
  const res = await apiClient.post("/v1/admin/teachers", data);
  return res.data;
}

export async function updateTeacher(
  id: string,
  data: { first_name?: string; last_name?: string }
) {
  const res = await apiClient.patch(`/v1/admin/teachers/${id}`, data);
  return res.data;
}

export async function deactivateTeacher(id: string) {
  const res = await apiClient.post(
    `/v1/admin/teachers/${id}/deactivate`
  );
  return res.data;
}