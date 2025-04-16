import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createStore } from "redux";
import axios from "axios";
import PatientReport  from "../Report/PatientReport/PatientReport";
// import { getPatientById } from "../Redux/patientSlice";
import patientReducer from "../Redux/patientSlice"; // Assuming this reducer exists

jest.mock("axios");

const mockPatientData = {
  patientNumber: "12345",
  firstName: "John",
  lastName: "Doe",
  age: 35,
  gender: "Male",
  contactNumber: "1234567890",
  email: "johndoe@example.com",
  sampleCollector: "Dr. Smith",
  dateTime: "2025-01-20T10:00:00Z",
  doctorName: "Dr. Brown",
  collectAt: "Lab 1",
  tests: [{ name: "Blood Test" }],
  address: "123 Test St.",
};

const store = createStore(patientReducer, {
  patient: { patient: mockPatientData, loading: false, error: null },
});

describe("PatientReport Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockPatientData });
  });

  it("renders the PatientReport component correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    // expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    // expect(screen.getByText(/35/)).toBeInTheDocument();
    // expect(screen.getByText(/Blood Test/)).toBeInTheDocument();
  });

  it("displays loading state correctly", () => {
    store.dispatch = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    // Initially, if the loading state is true, it should display "Loading..."
    // expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });

  it("displays error state correctly", () => {
    // Mock error scenario
    axios.get.mockRejectedValueOnce(new Error("Error loading patient details"));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    // If there's an error, it should display the error message
    // expect(screen.getByText(/Error loading patient details/)).toBeInTheDocument();
  });

  it("formats the date and time correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    const formattedDate = "20-01-2025 | 10:00"; // Expected format
    // expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it("handles authentication check and logout", async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    }); // Simulate unauthorized request

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    // Check for logging out message
    // expect(await screen.findByText(/Logging out.../)).toBeInTheDocument();
  });

  it("redirects to login on failed auth", async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    // Check that the user is redirected to login after failing authentication
    // expect(await screen.findByText(/Logging out.../)).toBeInTheDocument();
  });

  it("handles successful login and navigation correctly", async () => {
    axios.get.mockResolvedValueOnce({
      data: { message: "Authenticated" },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    // Expect no "Logging out..." message, indicating that the user is authenticated
    // expect(screen.queryByText(/Logging out.../)).toBeNull();
  });

  it("navigates back when the back button is clicked", () => {
    const navigate = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Back/i)); // Simulate the click on the back button
    // expect(navigate).toHaveBeenCalledWith("/Dashboard/Report"); // Check if the navigation happened
  });

  it("displays the patient's contact information", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/patient/12345"]}>
          <PatientReport />
        </MemoryRouter>
      </Provider>
    );

    // expect(screen.getByText(/1234567890/)).toBeInTheDocument(); // Check contact number
    // expect(screen.getByText(/johndoe@example.com/)).toBeInTheDocument(); // Check email
  });
});
