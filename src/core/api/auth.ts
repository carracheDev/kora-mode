import { clearApiToken, getApiToken, koraApi, saveApiToken } from "./client";

export type ApiCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

type CustomerResponse = { data: ApiCustomer; token?: string };

function persistCustomerToken(response: CustomerResponse): ApiCustomer {
  if (response.token) saveApiToken(response.token);
  if (!response.token && !getApiToken()) {
    throw new Error("Le backend n’a pas renvoyé de jeton de connexion.");
  }
  return response.data;
}

export async function loginCustomer(email: string, password: string): Promise<ApiCustomer> {
  const response = await koraApi<CustomerResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    token: null,
  });
  return persistCustomerToken(response);
}

export async function registerCustomer(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}): Promise<ApiCustomer> {
  const response = await koraApi<CustomerResponse>("/auth/register", {
    method: "POST",
    body: input,
    token: null,
  });
  return persistCustomerToken(response);
}

export async function fetchCurrentCustomer(): Promise<ApiCustomer | null> {
  if (!getApiToken()) return null;
  const response = await koraApi<{ data: ApiCustomer }>("/auth/me");
  return response.data;
}

export async function logoutCustomer(): Promise<void> {
  try {
    if (getApiToken()) await koraApi<void>("/auth/logout", { method: "POST", body: {} });
  } finally {
    clearApiToken();
  }
}
