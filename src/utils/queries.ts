export const createQueryFn = (endpoint: string) => async () => {
  return fetch(endpoint).then((response) => response.json());
};

export async function fetchProjects() {
  const response = await fetch("/api/v1/projects");
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

export async function fetchProject(token: string, includeThreads = false) {
  const url = `/api/v1/projects/${token}${includeThreads ? "?includeThreads=true" : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json();
}

export async function createProject(name: string, customInstructions?: string) {
  const response = await fetch("/api/v1/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, customInstructions }),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
}

export async function updateProject(
  token: string,
  data: { name?: string; customInstructions?: string },
) {
  const response = await fetch(`/api/v1/projects/${token}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export async function deleteProject(token: string) {
  const response = await fetch(`/api/v1/projects/${token}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
}

export async function fetchThreadsByProject(projectToken: string) {
  const response = await fetch(`/api/v1/threads?projectToken=${projectToken}`);
  if (!response.ok) throw new Error("Failed to fetch threads");
  const data = await response.json();
  // Extract threads from paginated response
  return data.data ?? [];
}
