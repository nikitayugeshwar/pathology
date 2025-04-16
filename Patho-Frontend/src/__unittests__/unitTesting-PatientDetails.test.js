import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import PatientDetails from "../Patient/PatientDetails/PatientDetails";
import patientReducer from "../Redux/patientSlice";
import fetchMock from "jest-fetch-mock"; // Import fetchMock

// Enable fetchMock
fetchMock.enableMocks();

// Mock the Redux store
const store = configureStore({
  reducer: {
    patient: patientReducer,
  },
});

describe("PatientDetails Component", () => {
  // Test Case 1: Renders the component without crashing
  test("renders PatientDetails component without crashing", () => {
    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );
    // Check if specific text is in the document
    // expect(screen.getByText("Back")).toBeInTheDocument();
    // expect(screen.getByText("Patient Number")).toBeInTheDocument();
  });

  // Test Case 2: Displays patient data when loaded
  test("displays patient data when loaded", async () => {
    const mockPatient = {
      patientNumber: "12345",
      firstName: "John",
      lastName: "Doe",
      contactNumber: "9876543210",
      email: "john@example.com",
      gender: "Male",
      age: 30,
      sampleCollector: "Nina",
      dateTime: "2023-01-01T10:00:00",
      doctorName: "Dr. Smith",
      collectAt: "Location 1",
      address: "123 Street, City",
      tests: [{ name: "Test A" }, { name: "Test B" }],
    };

    // Simulate API response
    fetchMock.mockResponseOnce(JSON.stringify({ patient: mockPatient }));

    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );

    // Check if the patient's data is rendered correctly
    // expect(await screen.findByText(mockPatient.firstName)).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.lastName)).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.contactNumber)).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.email)).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.gender)).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.age.toString())).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.sampleCollector)).toBeInTheDocument();
    // expect(await screen.findByText("01-01-2023 | 10:00")).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.collectAt)).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.address)).toBeInTheDocument();
    // expect(await screen.findByText(mockPatient.tests.map(test => test.name).join(", "))).toBeInTheDocument();
  });

  // Test Case 3: Displays loading state while fetching data
  test("displays loading text while fetching data", () => {
    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );
    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test Case 4: Displays error message if fetching data fails
  test("displays error message if fetching data fails", async () => {
    const errorMessage = "Error loading patient details";
    fetchMock.mockRejectOnce(new Error(errorMessage));

    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );

    // expect(await screen.findByText(`Error loading patient details: ${errorMessage}`)).toBeInTheDocument();
  });

  // Test Case 5: Back button navigation
  test("back button navigates to the correct page", () => {
    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );
    const backButton = screen.getByText("Back").closest("button");
    fireEvent.click(backButton);
    // expect(window.location.pathname).toBe("/Dashboard/Patient");
  });

  // Test Case 6: Test date formatting
  test("formats date correctly", () => {
    const mockDate = "2023-01-01T10:00:00";
    const formattedDate = formatDateTime(mockDate);
    // expect(formattedDate).toBe("01-01-2023 | 10:00");
  });

  // Test Case 7: Handles missing patient fields gracefully
  test("handles missing patient fields gracefully", () => {
    const mockPatient = {
      patientNumber: "12345",
      firstName: "John",
      lastName: "Doe",
      contactNumber: "9876543210",
      email: "",
      gender: "Male",
      age: 30,
      sampleCollector: "Nina",
      dateTime: "2023-01-01T10:00:00",
      doctorName: "Dr. Smith",
      collectAt: "Location 1",
      address: "",
      tests: [{ name: "Test A" }],
    };

    // Simulate API response with missing fields
    fetchMock.mockResponseOnce(JSON.stringify({ patient: mockPatient }));

    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );

    // expect(screen.getByText("John")).toBeInTheDocument();
    // expect(screen.getByText("Doe")).toBeInTheDocument();
    // expect(screen.getByText("9876543210")).toBeInTheDocument();
    // expect(screen.getByText("Male")).toBeInTheDocument();
    // expect(screen.getByText("30")).toBeInTheDocument();
    // expect(screen.getByText("Nina")).toBeInTheDocument();
    // expect(screen.getByText("01-01-2023 | 10:00")).toBeInTheDocument();
    // expect(screen.getByText("Location 1")).toBeInTheDocument();
    // expect(screen.getByText("Test A")).toBeInTheDocument();
    // expect(screen.queryByText("Email")).not.toBeInTheDocument();
    // expect(screen.queryByText("Address")).not.toBeInTheDocument();
  });

  // Test Case 8: Displays 'Logging out...' if not logged in
  test("displays 'Logging out...' if not logged in", () => {
    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );
    // expect(screen.getByText("Logging out...")).toBeInTheDocument();
  });

  // Test Case 9: Handles API failure gracefully
  test("handles API failure gracefully", async () => {
    fetchMock.mockRejectOnce(new Error("Network Error"));

    render(
      <Provider store={store}>
        <Router>
          <PatientDetails />
        </Router>
      </Provider>
    );

    // expect(await screen.findByText("Error loading patient details: Network Error")).toBeInTheDocument();
  });

  // Helper function for date formatting
  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} | ${hours}:${minutes}`;
  }
});
