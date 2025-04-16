// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import configTemplateReducer from "./configTemplateSlice";
import testFieldReducer from "./configTestFeildSlice";
import testReducer from "./configTestSlice";
import fileReducer from "./fileSlice";
import patientReducer from "./patientSlice";
import pdfReducer from "./pdfSlice";
import testReportReducer from "./testReportSlice";
import userReducer from "./userSlice";

// Combine all reducers
const appReducer = combineReducers({
  files: fileReducer,
  pdf: pdfReducer,
  patient: patientReducer,
  test: testReducer,
  testFields: testFieldReducer,
  configTemplate: configTemplateReducer,
  testReport: testReportReducer,
  user: userReducer,
});

// Root reducer to reset the state on logout
const rootReducer = (state, action) => {
  if (action.type === "user/logout") {
    state = undefined; // Clear all state
  }
  return appReducer(state, action);
};

export default rootReducer;
