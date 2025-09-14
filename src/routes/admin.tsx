import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdminUserManagement } from "@/pages/admin/admin-user-management";
import { authClient } from "@/utils/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (!session?.data?.user) {
      throw redirect({
        to: "/",
      });
    }

    // Check if user has admin role
    if (session.data.user.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
  },
  component: AdminUserManagement,
});
