import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ChangePass from "./ChangePass/ChangePass";
import Configuration from "./Configuration/Configuration";
import AddReport from "./Configuration/ReportTempMan/AddReport/AddReport";
import EditReport from "./Configuration/ReportTempMan/EditReport/EditReport";
import ReportTempMan from "./Configuration/ReportTempMan/ReportTempMan";
import Email from "./Configuration/SocialmediaIntegration/Email/Email";
import Socialmedia from "./Configuration/SocialmediaIntegration/socialMedia";
import Twilio from "./Configuration/SocialmediaIntegration/Twilio/Twilio";
import AddFeild from "./Configuration/Tests/AddFeild/AddFeild";
// import AddTests from "./Configuration/Tests/AddTests/AddTests";
import EditFeild from "./Configuration/Tests/EditFeild/EditFeild";
// import EditTests from "./Configuration/Tests/EditTests/EditTests";
import Tests from "./Configuration/Tests/Tests";
import TestsDetails from "./Configuration/Tests/TestsDetails/TestsDetails";
import Dashboard from "./Dashboard/Dashboard";
import ForgotPass from "./ForgotPass/ForgotPass";
import Layout from "./Layout";
import Login from "./Login/Login";
import Otpvarification from "./Otpvarification/Otpvarification";
import AddPatient from "./Patient/AddPatient/AddPatient";
import EditPatient from "./Patient/EditPatient/EditPatient";
import Patient from "./Patient/Patient";
import PatientDetails from "./Patient/PatientDetails/PatientDetails";
import store from "./Redux/store";
import PatientReport from "./Report/PatientReport/PatientReport";
import Report from "./Report/Report";
import ViewReport from "./Report/ViewReport/ViewReport";
import SuperAdminLayout from "./SuperAdmin/SuperAdminLayout";
import SuperAdminChangepass from "./SuperAdminChangePass/SuperAdminChangepass";
import SuperAdminForgotPass from "./SuperAdminForgotPass/SuperAdminForgotPass";
import SuperAdminLogin from "./SuperAdminLogin/SuperAdminLogin";
import CreateTestReport from "./Test/CreateTestReport/CreateTestReport";
import EditTestReport from "./Test/EditTestReport/EditTestReport";
import PatientTestDetails from "./Test/PatientTestDetails/PatientTestDetails";
import Test from "./Test/Test";
import TestDetails from "./Test/TestDetails/TestDetails";
import AddUser from "./UserManagement/AddUser/AddUser";
import EditUser from "./UserManagement/EditUser/EditUser";
import UserDetail from "./UserManagement/UserDetail";
import UserManagement from "./UserManagement/UserManagement";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/SuperAdminLogin" element={<SuperAdminLogin />} />

      <Route path="/SuperAdminForgotPass" element={<SuperAdminForgotPass />} />
      <Route path="/ForgotPass" element={<ForgotPass />} />
      <Route path="/SuperAdminChangePass" element={<SuperAdminChangepass />} />
      <Route path="/ChangePass" element={<ChangePass />} />
      <Route path="/Otpvarification" element={<Otpvarification />} />
      <Route path="/Dashboard" element={<Layout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="Patient" element={<Patient />} />
        <Route path="Addpatient" element={<AddPatient />} />
        <Route path="EditPatient/:id" element={<EditPatient />} />
        <Route path="PatientDetails/:id" element={<PatientDetails />} />

        {/* Test */}
        <Route path="Test" element={<Test />} />
        <Route path="TestDetails/:id" element={<TestDetails />} />
        <Route path="PatientTestDetails/:id" element={<PatientTestDetails />} />
        <Route path="CreateTestReport/:id" element={<CreateTestReport />} />
        <Route path="EditTestReport/:id" element={<EditTestReport />} />

        {/* Report */}
        <Route path="Report" element={<Report />} />
        <Route path="PatientReport/:id" element={<PatientReport />} />
        <Route path="ViewReport/:id" element={<ViewReport />} />

        {/* Configuration */}
        <Route path="configuration" element={<Configuration />} />
        <Route path="SocialmediaIntegration" element={<Socialmedia />} />
        <Route path="Email" element={<Email />} />
        <Route path="Twilio" element={<Twilio />} />

        {/* Tests */}
        <Route path="Tests" element={<Tests />} />
        {/* <Route path="AddTests" element={<AddTests />} /> */}
        {/* <Route path="EditTests/:id" element={<EditTests />} /> */}
        <Route path="TestsDetails/:id" element={<TestsDetails />} />
        <Route path="AddFeild/:testId" element={<AddFeild />} />
        <Route path="EditFeild/:testId" element={<EditFeild />} />

        {/* Report */}
        <Route path="AddReport" element={<AddReport />} />
        <Route path="EditReport/:id" element={<EditReport />} />
        <Route path="ReportTempMan" element={<ReportTempMan />} />
      </Route>
      {/* User Management */}
      <Route path="/superAdmin" element={<SuperAdminLayout />}>
        <Route path="" element={<UserManagement />} />
        <Route path="addUser" element={<AddUser />} />
        <Route path="editUser/:id" element={<EditUser />} />
        <Route path="userDetail/:id" element={<UserDetail />} />
      </Route>
    </>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
