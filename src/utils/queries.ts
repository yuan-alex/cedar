export const createQueryFn = (endpoint: string) => async () => {
  return fetch(endpoint).then((response) => response.json());
};
