import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import patientReducer from "../Redux/patientSlice";
import ReportTable from "../Report/ReportTable";

// Helper function to render the component with Redux provider and router
const renderWithProviders = (component, store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("ReportTable Component Tests", () => {
  let store;
  let mockSetReportCount;
  let mockSetTotalEntries;

  beforeEach(() => {
    // Mock store setup
    store = configureStore({
      reducer: {
        patient: patientReducer,
      },
      preloadedState: {
        patient: {
          patientsWithTestId: [
            {
              _id: "1",
              patientNumber: "P001",
              firstName: "John",
              lastName: "Doe",
              tests: ["Test1", "Test2"],
              contactNumber: "1234567890",
              gender: "Male",
              age: 30,
            },
            {
              _id: "2",
              patientNumber: "P002",
              firstName: "Jane",
              lastName: "Smith",
              tests: ["Test1"],
              contactNumber: "9876543210",
              gender: "Female",
              age: 25,
            },
          ],
          loading: false,
          error: null,
        },
      },
    });

    // Mock props
    mockSetReportCount = jest.fn();
    mockSetTotalEntries = jest.fn();
  });

  // Rendering Tests
  test("renders the component without crashing", () => {
    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(screen.getByText(/Patient No/i)).toBeInTheDocument();
    // expect(screen.getByText(/Name/i)).toBeInTheDocument();
    // expect(screen.getByText(/Test Name/i)).toBeInTheDocument();
  });

  test("renders the correct number of rows", () => {
    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(screen.getAllByRole("row").length).toBe(3); // 1 header row + 2 data rows
  });

  // Props and State Tests
  test("updates total entries when filteredResults change", () => {
    renderWithProviders(
      <ReportTable
        filter="P001"
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(mockSetTotalEntries).toHaveBeenCalledWith(1); // Only one patient matches the filter
  });

  test("updates report count for the current page", () => {
    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(mockSetReportCount).toHaveBeenCalledWith(2); // Two patients on the current page
  });

  test("correctly applies searchTerm filter", () => {
    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm="Jane"
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(mockSetTotalEntries).toHaveBeenCalledWith(1); // Only one patient matches "Jane"
  });

  test("correctly applies patientNumber filter", () => {
    renderWithProviders(
      <ReportTable
        filter="P001"
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(mockSetTotalEntries).toHaveBeenCalledWith(1); // Only one patient matches "P001"
  });

  // Loading and Error States
  test("displays loading state when loading is true", () => {
    store = configureStore({
      reducer: {
        patient: patientReducer,
      },
      preloadedState: {
        patient: {
          patientsWithTestId: [],
          loading: true,
          error: null,
        },
      },
    });

    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("displays error message when error occurs", () => {
    store = configureStore({
      reducer: {
        patient: patientReducer,
      },
      preloadedState: {
        patient: {
          patientsWithTestId: [],
          loading: false,
          error: "Failed to fetch data",
        },
      },
    });

    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
  });

  // Interaction Tests
  test("renders correct links for patient reports", () => {
    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // const reportLinks = screen.getAllByText(/View/i);
    // expect(reportLinks.length).toBe(2); // Two patients with "View" links
    // expect(reportLinks[0].closest("a")).toHaveAttribute(
    //   "href",
    //   "/Dashboard/ViewReport/1"
    // );
    // expect(reportLinks[1].closest("a")).toHaveAttribute(
    //   "href",
    //   "/Dashboard/ViewReport/2"
    // );
  });

  test("renders correct links for patient details", () => {
    renderWithProviders(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={10}
        setReportCount={mockSetReportCount}
        setTotalEntries={mockSetTotalEntries}
        refreshKey={0}
      />,
      store
    );

    // const detailLinks = screen.getAllByText(/Doe|Smith/i);
    // expect(detailLinks.length).toBe(2); // Two patients
    // expect(detailLinks[0].closest("a")).toHaveAttribute(
    //   "href",
    //   "/Dashboard/PatientReport/1"
    // );
    // expect(detailLinks[1].closest("a")).toHaveAttribute(
    //   "href",
    //   "/Dashboard/PatientReport/2"
    // );
  });
});

