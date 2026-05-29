import axios from 'axios';
import { message } from 'antd';
import { getAuthLocalToken, clearAuthLocal } from './AuthUtils';

const BASE_URL = import.meta.env.VITE_SERVER_HOST + '/api';

export const login = async (userObj) => {
  console.log('login: ', userObj);
  return axios
    .post(BASE_URL + '/auth/login', userObj)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const register = async (userObj) => {
  return axios
    .post(BASE_URL + '/auth/register', userObj)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};
export const resetPassword = async (email) => {
  const body = { email: email };
  return axios
    .post(BASE_URL + '/auth/password/reset', body)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getUser = async () => {
  return axios
    .get(BASE_URL + '/user/list')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const apiUtil = async (
  path,
  method,
  signal = null,
  data = null,
  upload = false,
) => {
  if (method.toLowerCase() === 'get' && data) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== '' && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredData).toString();
    path += queryString == '' ? '' : `?${queryString}`;
  }
  console.log('request:', method.toUpperCase(), path, 'data:', data);

  const sendMessage = (messageText) => {
    message.destroy();
    message.error(messageText);
  };

  return axios({
    method,
    url: BASE_URL + path,
    headers: {
      Authorization: `Bearer ${getAuthLocalToken()}`,
      'Content-Type': upload ? 'multipart/form-data' : 'application/json',
    },
    // timeout: 10000,
    signal: signal,
    data: method.toLowerCase() === 'get' ? null : data,
  })
    .then((response) => {
      console.log('response:', method.toUpperCase(), path, response.data);
      return response.data;
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        return { isSystemError: true, reason: 'canceled' };
      }
      if (error.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message || '伺服器發生錯誤';
        const errorData = error.response?.data;
        switch (status) {
          case 401:
            sendMessage(error.response.msg || '請先登入');
            window.location.href = `#/login`;
            break;
          case 40101:
            sendMessage(error.response.msg || '登入逾時，請重新登入');
            clearAuthLocal();
            window.location.href = `#/login`;
            break;
          case 40102:
            sendMessage(error.response.msg || '無效的登入憑證，請重新登入');
            clearAuthLocal();
            window.location.href = `#/login`;
            break;
          case 403:
            sendMessage('您沒有權限執行此操作');
            break;
          case 404:
            sendMessage('找不到請求的資源');
            break;
          default:
            sendMessage(`錯誤 (${status}): ${backendMessage}`);
        }
      } else if (error.request) {
        if (error.code === 'ECONNABORTED') {
          sendMessage('網路請求超時，請稍後再試');
        } else {
          sendMessage(
            '無法連線至伺服器，請檢查網路連線或稍後再試',
            '/error/500',
          );
        }
      }
      return { isSystemError: true, reason: 'system_failure' };
    });
};

export const handleException = (response) => {
  if (response.status === 401) {
    // Token expired or invalid, redirect to login page
    alert(TEXT_JWT_EXPIRED_ORINVALID);
    window.location.href = '/login';
    return;
  } else if (response.status === 403) {
    // Forbidden, show error message
    return alert(TEXT_NO_PERMISSION);
  } else if (response.status === 404) {
    // Not found, show error message
    return alert(TEXT_RESOURCE_NOT_FOUND);
  } else if (response.status !== 200) {
    // Other errors, show generic error message
    return alert(TEXT_OTHER_ERROR);
  }
  return false;
};

export const handleErrer = (error) => {
  if (error.code === 'ERR_NETWORK') {
    return alert(TEXT_NETWORK_ERROR);
  } else if (response.status === 403) {
    return alert(TEXT_NO_PERMISSION);
  } else if (response.status === 404) {
    return alert(TEXT_RESOURCE_NOT_FOUND);
  } else if (response.status !== 200) {
    return alert(TEXT_OTHER_ERROR);
  }
  return false;
};

export const TEXT_JWT_EXPIRED_ORINVALID =
  'Token expired or invalid, please login again';
export const TEXT_NO_PERMISSION =
  'You do not have permission to access this resource.';
export const TEXT_RESOURCE_NOT_FOUND = 'Resource not found.';
export const TEXT_OTHER_ERROR = 'An error occurred. Please try again later.';
export const TEXT_NETWORK_ERROR =
  'Network error. Please check your connection and try again.';
export const TEXT_SESSION_EXPIRED = '登入連線已逾時，請重新登入。';
