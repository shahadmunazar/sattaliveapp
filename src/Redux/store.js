// store.js
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from "../Redux/Reducers/AuthSlice"
// import MockTestSlice from './Reducers/MockTestSlice';
// import GetProfileDataSlice from  "../Redux/Reducers/ProfileSlice"
// import WrittingSlice from '../Redux/Reducers/WrittingSlice'
// import ReadingSlice from "../Redux/Reducers/ReadingSlice"
// import SpeakingSlice from '../Redux/Reducers/SpeakingSlice';
// import ListeningSlice from '../Redux/Reducers/ListeningSlice';

export const store = configureStore({
  reducer: {
    login: loginSlice,
    // MockTestsData: MockTestSlice,
    // UserProfileData: GetProfileDataSlice,
    // SummWrittingData:WrittingSlice,
    // ReadingData:ReadingSlice,
    // SpeakingData:SpeakingSlice,
    // ListeningData:ListeningSlice
  },
});
