// pdfSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialPdfState = {
  showPopup: false,
  clinicName: '',
  doctorName: '',
  headerName: '',
  subHeaderName: '',
  testType: '',
  footer: ''
};

const pdfSlice = createSlice({
  name: 'pdf',
  initialState: initialPdfState,
  reducers: {
    // Define your reducers here
  }
});

export const { /* export your actions here */ } = pdfSlice.actions;

export default pdfSlice.reducer;
