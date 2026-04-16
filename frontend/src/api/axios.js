// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api/v1",
//   timeout: 10000,
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "https://primetrade-backend-bwdc.onrender.com/api/v1",
  timeout: 10000,
});

export default api;