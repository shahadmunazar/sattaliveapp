// AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = "https://liveapi.sattalives.com";

// export const SendEmailOtp = createAsyncThunk('OTP/SendEmailOtp',
//   async (data) => {
//     let OPTIONS = {
//       url: `${baseURL}/api/send-otp`,
//       method: "POST",
//       data: data,
//       headers: {
//         'Accept': 'application/json'
//       },
//     };
//     return axios(OPTIONS)
//       .then(res => {
//         console.log(res.data, 'this is res login');
//         return res
//       })
//   })

// export const OtpVerifys = createAsyncThunk('OTP/OtpVerify',
//   async (data) => {
//     let OPTIONS = {
//       url: `${baseURL}/api/verify-otp`,
//       method: "POST",
//       data: data,
//       headers: {
//         'Accept': 'application/json'
//       },
//     };
//     return axios(OPTIONS)
//       .then(res => {
//         console.log(res.data, 'this is res login verify')
//         return res
//       })
//   })

// export const ResendOtp = createAsyncThunk('OTP/ResendOtp',
//   async (data) => {
//     let OPTIONS = {
//       url: `${baseURL}/api/resend-otp`,
//       method: "POST",
//       data: data,
//       headers: {
//         'Accept': 'application/json'
//       },
//     };
//     return axios(OPTIONS)
//       .then(res => {
//         console.log(res.data, 'this is res resend otp')
//         return res
//       })
//   })
// export const ResetPass = createAsyncThunk('pass/ResetPass',
//   async (data) => {
//     let OPTIONS = {
//       url: `${baseURL}/api/update-password`,
//       method: "PUT",
//       data: data,
//       headers: {
//         'Accept': 'application/json'
//       },
//     };
//     return axios(OPTIONS)
//       .then(res => {
//         console.log(res.data, 'this is res reset pass')
//         return res
//       })
//   })

// export const RegisterUser = createAsyncThunk('User/RegisterUser',
//   async (data) => {
//     let OPTIONS = {
//       url: `${baseURL}/api/register`,
//       method: "POST",
//       data: data,
//       headers: {
//         'Accept': 'application/json'
//       },
//     };
//     return axios(OPTIONS)
//       .then(res => {
//         console.log(res.data, 'this is res Register')
//         return res
//       })
//   })
export const LoginUser = createAsyncThunk('User/LoginUser',
  async () => {
    const token = await AsyncStorage.getItem('userToken');
    let OPTIONS = {
      url: `${baseURL}/api/user/profile`,
      method: "GET",
      // data: data,
      headers: {
                  'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                  'Content-Type': 'application/json',
                },
    };
    return axios(OPTIONS)
      .then(res => {
        console.log('this is res LoginUser',res);
        return res
      })
      .catch(error => {
        console.error('LoginUser Error:', error);
        // Check for 403 error
        // if (error.response && error.response.status === 403) {
        //   return rejectWithValue('Access denied. You are not authorized to perform this action.');
        // }

        // Handle other errors with a generic message or specific error response
        // return rejectWithValue(error.response?.data?.message || 'Login failed, please try again.');
      });
  })

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    // SendEmailOtp: {
    //   loading: false,
    //   result: [],
    //   error: null,
    // },
    // OtpVerifys: {
    //   loading: false,
    //   result: [],
    //   error: null,
    // },
    // ResendOtp: {
    //   loading: false,
    //   result: [],
    //   error: null,
    // },
    // ResetPass: {
    //   loading: false,
    //   result: [],
    //   error: null,
    // },
    // RegisterUser: {
    //   loading: false,
    //   result: [],
    //   error: null,
    // },
    LoginUser: {
      loading: false,
      result: [],
      error: null,
    }
  },
  reducers: {
    // your other non-async reducers go here
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(SendEmailOtp.pending, (state, action) => {
    //     state.SendEmailOtp.loading = true;
    //   })
    //   .addCase(SendEmailOtp.fulfilled, (state, action) => {
    //     state.SendEmailOtp.loading = false;
    //     state.SendEmailOtp.result = action.payload.data;
    //   })
    //   .addCase(SendEmailOtp.rejected, (state, action) => {
    //     state.SendEmailOtp.loading = false;
    //     state.SendEmailOtp.error = action.error;
    //   });

    /////////////////////////////////////////////////////////////   OtpVerify   /////////////////////////////

    // builder
    //   .addCase(OtpVerifys.pending, (state, action) => {
    //     state.OtpVerifys.loading = true;
    //   })
    //   .addCase(OtpVerifys.fulfilled, (state, action) => {
    //     state.OtpVerifys.loading = false;
    //     state.OtpVerifys.result = action.payload.data;
    //   })
    //   .addCase(OtpVerifys.rejected, (state, action) => {
    //     state.OtpVerifys.loading = false;
    //     state.OtpVerifys.error = action.error;
    //   });
    //////////////////////////////////////////////////////////////////Re-send otp /////////////////////////////////
    // builder
    //   .addCase(ResendOtp.pending, (state, action) => {
    //     state.ResendOtp.loading = true;
    //   })
    //   .addCase(ResendOtp.fulfilled, (state, action) => {
    //     state.ResendOtp.loading = false;
    //     state.ResendOtp.result = action.payload.data;
    //   })
    //   .addCase(ResendOtp.rejected, (state, action) => {
    //     state.ResendOtp.loading = false;
    //     state.ResendOtp.error = action.error;
    //   });
    //////////////////////////////////////////////////////////////////Reset password /////////////////////////////////
    // builder
    //   .addCase(ResetPass.pending, (state, action) => {
    //     state.ResetPass.loading = true;
    //   })
    //   .addCase(ResetPass.fulfilled, (state, action) => {
    //     state.ResetPass.loading = false;
    //     state.ResetPass.result = action.payload.data;
    //   })
    //   .addCase(ResetPass.rejected, (state, action) => {
    //     state.ResetPass.loading = false;
    //     state.ResetPass.error = action.error;
    //   });

    /////////////////////////////////////////////////////////////   Register   /////////////////////////////

    // builder
    //   .addCase(RegisterUser.pending, (state, action) => {
    //     state.RegisterUser.loading = true;
    //   })
    //   .addCase(RegisterUser.fulfilled, (state, action) => {
    //     state.RegisterUser.loading = false;
    //     state.RegisterUser.result = action.payload.data;
    //   })
    //   .addCase(RegisterUser.rejected, (state, action) => {
    //     state.RegisterUser.loading = false;
    //     state.RegisterUser.error = action.error;
    //   });

    /////////////////////////////////////////////////////////////// Login User  //////////////////////////

    builder
      .addCase(LoginUser.pending, (state, action) => {
        state.LoginUser.loading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.LoginUser.loading = false;
        state.LoginUser.result = action.payload.data;
        // console.log(action.payload.data.token, "3456789");
        // localStorage.setItem("authToken", action.payload.data.token);
        // navigate("/dashboard");
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.LoginUser.loading = false;
        state.LoginUser.error = action.error;
      });
  },
});

export default loginSlice.reducer;
