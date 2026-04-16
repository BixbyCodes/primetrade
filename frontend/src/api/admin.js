import api from "./axios";

export const getStats = () => api.get("/admin/stats");
export const getUsers = () => api.get("/admin/users");
export const toggleUser = (id) => api.patch(`/admin/users/${id}/toggle`);
export const getAllTasks = () => api.get("/admin/tasks");
