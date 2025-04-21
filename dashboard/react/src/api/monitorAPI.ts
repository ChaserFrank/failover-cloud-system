// src/api/monitorAPI.ts
const BASE_URL = "http://localhost:5000"; // Update with your backend server

export const fetchServerStatus = async () => {
  const res = await fetch(`${BASE_URL}/status`);
  return await res.json();
};

export const fetchUsageStats = async () => {
  const res = await fetch(`${BASE_URL}/usage`);
  return await res.json();
};

export const fetchFailoverStatus = async () => {
  const res = await fetch(`${BASE_URL}/failover`);
  return await res.json();
};

export const fetchSystemLogs = async () => {
  const res = await fetch(`${BASE_URL}/logs`);
  return await res.json();
};

export const resetToPrimary = async () => {
  const res = await fetch(`${BASE_URL}/reset`, { method: "POST" });
  return await res.json();
};
