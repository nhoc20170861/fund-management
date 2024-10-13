import axios from "axios";
import configs from "configs";

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
      config.url.indexOf("/login") >= 0 ||
      config.url.indexOf("/refreshtoken") >= 0
    ) {
      return config;
    }
    const accessToken = localStorage.getItem("accessToken");
    config.headers.Authorization = accessToken ? accessToken : "";
    config.headers.ContentType = "application/json";
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
      config.url.indexOf("/login") >= 0 ||
      config.url.indexOf("/refreshtoken") >= 0
    ) {
      return response;
    }
    const { errorCode, message } = response.data;
    if (errorCode && (errorCode === 401 || errorCode === 403)) {
      console.log(message);
      if (message === "jwt expired") {
        const refreshToken = localStorage.getItem("refreshToken");

        try {
          const { data } = await sendRefreshToken(refreshToken);
          if (data.success) {
            config.headers.Authorization = data.accessToken;
            localStorage.setItem("accessToken", data.accessToken);

            return instance(config);
          }
        } catch (error) {
          console.error(error);
          window.location.assign("/auth/login");
        }
      }
    }

    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const getAll = async () => await instance.get("user/all");

export const edit = async (userID, name, email) =>
  await instance.post("/user/edit", { userID, name, email });

export const forgotPassword = async (email) =>
  await instance.post("user/forgotpassword", { email });

export const confirmReset = async (id, password) =>
  await instance.post(`user/resetpass/${id}`, { password });

export const sendRefreshToken = async (refreshToken) =>
  await instance.post("/user/refreshtoken", { refreshToken });

// Api cho phan authentication
export const confirmRegister = async (id) =>
  await instance.post(`auth/confirm/${id}`);

export const login = async (username, password) =>
  await instance.post("auth/login", { username, password });

export const logout = async (accessToken) =>
  await instance.post("auth/logout", { accessToken });

export const register = async (
  username,
  email,
  password,
  phone,
  agency,
  role
) =>
  await instance.post("auth/register", {
    username,
    email,
    password,
    phone,
    agency,
    role,
  });

// Api cho phan control multi robot
export const getRobotConfigs = async () =>
  await instance.get(`ros/robot/getRobotConfigs`, {});

export const getTaskQueueFromAllRobots = async () =>
  await instance.get(`ros/robot/getTaskQueueFromAllRobots`, {});

export const getCurrentPose = async () =>
  await instance.get(`ros/robot/getCurrentPose`, {});

export const resetAllTaskQueue = async () =>
  await instance.post(`ros/robot/resetAllTaskQueue`, {});
export const sendNewTask = async (newTask) =>
  await instance.post(`ros/robot/createNewTask`, newTask);

// Api cho phan control a robot
export const createNewTaskForOneRobot = async (robotId, taskList) =>
  await instance.post(`ros/robot/${robotId}/create-new-task`, {
    taskList,
  });

export const resetAllGoalsForOneRobot = async (robotId) =>
  await instance.post(`ros/robot/${robotId}/reset-all-goals`, {});

// api handler state
export const setStateAccordingToRobotId = async ({ robotId, state }) =>
  await instance.post(`ros/robot/${robotId}/state/set-state`, { state });

export const callServiceActiveGoalAgain = async ({
  robotId,
  activeGoalAgain,
}) =>
  await instance.post(`ros/robot/${robotId}/activeGoalAgain`, {
    activeGoalAgain,
  });

// api crate and get targetPoint
export const createNewTargetPoint = async (newTargetPoint) =>
  await instance.post(`ros/robot/createNewTargetPoint`, { newTargetPoint });
export const getAllTargetPoint = async (mapId) =>
  await instance.get(`ros/robot/getAllTargetPoint/${mapId}`, {});

// load map config file
export const getConfigMap = async (fileName) =>
  await instance.get(`ros/robot/getConfigMap/${fileName}`, {});
export const getMapList = async () =>
  await instance.get(`ros/robot/getMapList`, {});
