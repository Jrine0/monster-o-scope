import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query"

export default function useAuth() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false
  });
}

async function getMe() {
  const res = await apiClient.get("/auth/me");
  if (res.status!=200) {
    throw new Error("Failed to fetch user data");
  }

  return res.data;
}

export function AuthHydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setHydrating = useAuthStore((s) => s.setHydrating);

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data) {
      clearSession();
      setHydrating(false);
      return;
    }

    const user = {
      id: data.id,
      email: data.email,
      name: `${data.first_name} ${data.last_name}`,
      role: data.roles?.[0] ?? "student",
      school_id: data.school_id,
      school_name: "", // backend doesn't return this here
      student_id: null,
    };

    setUser(user);
    setHydrating(false);
  }, [data, isLoading, isError]);

  return children;
}