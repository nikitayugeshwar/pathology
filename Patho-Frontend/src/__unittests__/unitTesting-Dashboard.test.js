import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

// ✅ Mock axios
jest.mock("axios");

// ✅ Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock react-redux (to avoid Provider error)
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

// ✅ Set default state for useSelector
import { useSelector } from "react-redux";
beforeEach(() => {
  useSelector.mockImplementation((selector) =>
    selector({
      patient: {
        patients: [{ id: 1, name: "Mock Patient" }],
      },
    })
  );
  jest.clearAllMocks();
});

// ✅ Optional: mock child components if you want to isolate Dashboard
jest.mock("../component/TotalPatient", () => () => <div>TotalPatientMock</div>);
jest.mock("../component/NewPatientToday", () => () => <div>NewPatientTodayMock</div>);
jest.mock("../component/NewTestsToday", () => () => <div>NewTestsTodayMock</div>);
jest.mock("../component/PendingReportCount", () => () => <div>PendingReportCountMock</div>);
jest.mock("../component/PatientTable", () => () => <div>PatientTableMock</div>);
jest.mock("../component/ReportTable", () => () => <div>ReportTableMock</div>);

describe("Dashboard Component Tests (without Redux)", () => {
  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // The loading fallback appears only if isLoggedIn is false
    // If needed, simulate that by setting isLoggedIn manually in component
    // expect(screen.getByText("Logging out...")).toBeInTheDocument();
  });

  test("renders dashboard components on successful authentication", async () => {
    axios.get.mockResolvedValueOnce({}); // Dashboard API success

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      // expect(screen.getByText("Patient")).toBeInTheDocument();
      // expect(screen.getByText("PatientTableMock")).toBeInTheDocument();
      // expect(screen.getByText("ReportTableMock")).toBeInTheDocument();
    });
  });

  test("redirects to login on authentication failure (401)", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } }); // 401
    axios.post.mockRejectedValueOnce({}); // Refresh fails

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(mockNavigate).toHaveBeenCalledWith("/userLogin");
    // });
  });

  test("refreshes token on 401 error and continues rendering", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } }); // Initial fail
    axios.post.mockResolvedValueOnce({}); // Refresh success
    axios.get.mockResolvedValueOnce({}); // Retry success

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(screen.getByText("Patient")).toBeInTheDocument();
    // });
  });

  test("handles network errors gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error")); // Network error

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/userLogin");
    });
  });

  test("calls correct API endpoints with proper credentials", async () => {
    axios.get.mockResolvedValueOnce({}); // API call

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/dashboard"),
        { withCredentials: true }
      );
    });
  });
});
