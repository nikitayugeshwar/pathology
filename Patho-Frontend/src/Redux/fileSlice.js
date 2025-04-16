import { createSlice } from "@reduxjs/toolkit";

const fileSlice = createSlice({
  name: "files",
  initialState: {
    logo: null,
    signature1: null,
    signature2: null,
    clinicName: "",
    doctorName: "",
    headerName: "",
    subHeaderName: "",
    footer: "",
    testType: ""  // Add testType to initialState
  },
  reducers: {
    uploadLogo: (state, action) => {
      state.logo = URL.createObjectURL(action.payload);
    },
    uploadSignature1: (state, action) => {
      state.signature1 = URL.createObjectURL(action.payload);
    },
    uploadSignature2: (state, action) => {
      state.signature2 = URL.createObjectURL(action.payload);
    },
    setClinicName: (state, action) => {
      state.clinicName = action.payload;
    },
    setDoctorName: (state, action) => {
      state.doctorName = action.payload;
    },
    setHeaderName: (state, action) => {
      state.headerName = action.payload;
    },
    setSubHeaderName: (state, action) => {
      state.subHeaderName = action.payload;
    },
    setFooter: (state, action) => {
      state.footer = action.payload;
    },
    setTestType: (state, action) => {  // Add reducer for testType
      state.testType = action.payload;
    }
  }
});

export const {
  uploadLogo,
  uploadSignature1,
  uploadSignature2,
  setClinicName,
  setDoctorName,
  setHeaderName,
  setSubHeaderName,
  setFooter,
  setTestType
} = fileSlice.actions;
export default fileSlice.reducer;
