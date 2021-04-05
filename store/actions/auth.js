import {Alert} from 'react-native';
// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

export const setDidTryAL = () => {
  return {type: SET_DID_TRY_AL};
};
export const authenticate = (userId, token) => {
  return {
    type: AUTHENTICATE,
    userId: userId,
    token: token,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const signup = (email, password) => {
  return async distpatch => {
    const response = await fetch (
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBixkkE1iPASuQ9eRiz-21lF_yoTU4aT0M',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify ({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResdata = await response.json ();
      const errorId = errorResdata.error.message;
      let message = 'Có lỗi';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'EMAIL Đã được 1 tài khoản khác sử dụng';
      }
      if (errorId === 'OPERATION_NOT_ALLOWED') {
        message = 'Đăng nhập bằng mật khẩu bị vô hiệu hóa ở dự án này';
      }
      if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message = 'Chúng tôi chặn máy này vì có những hoạt động bất thường';
      }
      throw new Error (message);
    }

    const resData = await response.json ();
    console.log (resData);
    distpatch (authenticate (resData.localId, resData.idToken));
    const expirationDate = new Date (
      new Date ().getTime () + parseInt (resData.expiresIn) * 1000
    ).toISOString ();
    saveDataToStorage (resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async distpatch => {
    const response = await fetch (
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBixkkE1iPASuQ9eRiz-21lF_yoTU4aT0M',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify ({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const errorResdata = await response.json ();
      const errorId = errorResdata.error.message;
      let message = 'Có lỗi';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'EMAIL không tồn tại';
      }
      if (errorId === 'INVALID_PASSWORD') {
        message = 'Sai mật khẩu';
      }
      if (errorId === 'USER_DISABLED') {
        message = 'Người dùng đã bị vô hiệu hóa bởi quản trị viên';
      }
      throw new Error (message);
    }
    const resData = await response.json ();
    console.log (resData);
    distpatch (authenticate (resData.localId, resData.idToken));

    const expirationDate = new Date (
      new Date ().getTime () + parseInt (resData.expiresIn) * 1000
    ).toISOString ();
    saveDataToStorage (resData.idToken, resData.localId, expirationDate);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem (
    'userData',
    JSON.stringify ({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString (),
    })
  );
};
