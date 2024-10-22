import axios from "axios";
import configs from "../configs";

// const https = require('https');
//
// const agent = new https.Agent({
//     rejectUnauthorized: false,
// });

// Khoi tao axios instance
const instance = axios.create({
  baseURL: configs.WS_BASE_URL,
  timeout: 10 * 1000, //3s
  headers: {
    "content-type": "application/json",
  },
});

// Khoi tao middleware, ham nay duoc goi truoc khi gui request
instance.interceptors.request.use(
  async (config) => {
    // Cac route nay` se khong can kiem tra accessToken
    if (
      config.url.indexOf("/signin") >= 0 ||
      config.url.indexOf("/refreshtoken") >= 0
    ) {
      return config;
    }

  const projectPattern = /\/projects\/\d+\/contributes/;
  if (projectPattern.test(config.url)) {
    config.headers['X-Key-SC'] = configs.HASH_KEY;
    return config;
  }
  
    
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Ham nay duoc goi khi kêt thuc mot request
instance.interceptors.response.use(
  async (response) => {
    // console.log("🚀 ~ file: ApiAxios.js:42 ~ response:", response.data);
    const config = response.config;

    // Cac route khong can check token
    if (
      config.url.indexOf("/signin") >= 0 ||
      config.url.indexOf("/refreshtoken") >= 0
    ) {
      return response;
    }
    // const { errorCode, message } = response.data;

    // if (errorCode && (errorCode === 401 || errorCode === 403)) {
    //   console.log(message);
    //   if (message === "jwt expired") {
    //     const refreshToken = localStorage.getItem("refreshToken");

    //     try {
    //       const { data } = await sendRefreshToken(refreshToken);
    //       if (data.success) {
    //         config.headers.Authorization = data.accessToken;
    //         localStorage.setItem("accessToken", data.accessToken);

    //         return instance(config);
    //       }
    //     } catch (error) {
    //       console.error(error);
    //       window.location.assign("/");
    //     }
    //   }
    // }

    // console.log("🚀 ~ response.data:", response.data);
    // if (response.data?.detail === "Token has expired") {
    //   try {
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("userInfo");
    //     localStorage.removeItem("userId");
    //     window.location.assign("/");
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    return response;
  },
  (error) => {
    // Handle errors
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized error occurred");

      // Remove tokens and user data from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userId");
      localStorage.removeItem("ProjectListForCurrentUser");

      // Redirect to the homepage
      window.location.assign("/"); // Change to the path you want to redirect to
    }

    // Return the error as a rejected promise to propagate the error
    return Promise.reject(error);
  }
);

// ===================== API cho phan user =====================
export const getAllUsers = async () => await instance.get("/users");

export const edit = async (userID, wallet_name, wallet_address) =>
  await instance.put(`/user/${userID}`, { wallet_name, wallet_address });

export const getOneUserByEmail = async (email) =>
  await instance.get(`/JSON.parse(projectList) : [];users?email=${email}`, {});

export const addReceiverForOneProject = async (receiver) =>
  await instance.post("/receivers", { ...receiver });

export const forgotPassword = async (email) =>
  await instance.post("/forgotpassword", { email });

export const confirmReset = async (id, password) =>
  await instance.post(`/resetpass/${id}`, { password });

export const sendRefreshToken = async (refreshToken) =>
  await instance.post("/refreshtoken", { refreshToken });

// Api cho phan authentication
export const confirmRegister = async (id) =>
  await instance.post(`/confirm/${id}`);

export const signin = async (email, password) =>
  await instance.post("/signin", { email, password });

export const logout = async (accessToken) =>
  await instance.post("/signout", { accessToken });

export const register = async (payload) =>
  await instance.post("/register", {
    name: payload.yourName || "unknow",
    email: payload.email || "unknow",
    password: payload.password,
    birthday: payload.birthDay || "1999-04-02",
    phone: payload.phone || "03381104xx",
    role: payload.role || "user",
  });

// ===================== API cho phan project =====================
export const getAllProjects = async () => await instance.get(`projects`, {});

export const getOneProjectDetail = async (projectId) =>
  await instance.get(`/projects/${projectId}`, {});

export const createNewProject = async (projectDetail) =>
  await instance.post(`/projects`, { ...projectDetail });

export const getProjectDetailByUserAndFundId = async (userId, fundId) =>
  await instance.get(`/projects/filter/user/${userId}/fund/${fundId}`, { });


// ===================== API cho phan contribute =====================
export const addContributeTranstaction = async (contributes_trans) =>
  await instance.post(`/projects/${projectId}/contributes`, { ...contributes_trans});


// ===================== API cho phan fund =====================
export const createNewFund = async (fundDetail) => {
  console.log(fundDetail);
  return await instance.post(`/funds/create`, { ...fundDetail });
};
export const getFundsForOneUser = async (userId) =>
  await instance.get(`/funds/user/${userId}`, {});


