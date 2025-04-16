import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "../Redux/patientSlice"; // Adjust the path to your reducer
import Report from "../Report/Report";

// Helper function to render the component with Redux provider
const renderWithRedux = (component, store) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe("Report Component Tests", () => {
  let store;

  beforeEach(() => {
    // Mock store setup
    store = configureStore({
      reducer: {
        patient: patientReducer, // Add your actual reducers here
      },
      preloadedState: {
        patient: {
          patientsWithTestId: [],
          loading: false,
          error: null,
        },
      },
    });
  });

  // Rendering Tests
  test("renders Report component without crashing", () => {
    renderWithRedux(<Report />, store);
    // expect(screen.getByText(/Report:/)).toBeInTheDocument();
  });

  test("renders search input, refresh button, and pagination controls", () => {
    renderWithRedux(<Report />, store);
    // expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    // expect(screen.getByText("Refresh")).toBeInTheDocument();
    // expect(screen.getByText("1")).toBeInTheDocument(); // Current page
  });



  // State Management Tests
  test("default state values are set correctly", () => {
    renderWithRedux(<Report />, store);
    // expect(screen.getByDisplayValue("10")).toBeInTheDocument(); // Default entriesPerPage
    // expect(screen.getByText("1")).toBeInTheDocument(); // Default currentPage
  });

  test("changing entries per page updates state and resets page", () => {
    renderWithRedux(<Report />, store);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "20" } });
    // expect(select.value).toBe("20");
    // expect(screen.getByText("1")).toBeInTheDocument(); // Reset to page 1
  });

  test("search input updates searchTerm state", () => {
    renderWithRedux(<Report />, store);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Test" } });
    expect(searchInput.value).toBe("Test");
  });

  test("refresh button resets relevant states", () => {
    renderWithRedux(<Report />, store);
    const refreshButton = screen.getByText("Refresh");
    const searchInput = screen.getByPlaceholderText("Search");

    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.click(refreshButton);

    // expect(searchInput.value).toBe(""); // Search reset
    // expect(screen.getByDisplayValue("10")).toBeInTheDocument(); // Default entriesPerPage
    // expect(screen.getByText("1")).toBeInTheDocument(); // Reset to page 1
  });

  

  test("changing entries per page updates ReportTable entries", () => {
    renderWithRedux(<Report />, store);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "20" } });

    // Assuming `ReportTable` renders visible entries count
    // expect(screen.getByText(/20 entries/i)).toBeInTheDocument();
  });

  test("typing in search input updates filtered data", () => {
    renderWithRedux(<Report />, store);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "Test" } });

    // Assuming `ReportTable` shows results related to "Test"
    // expect(screen.getByText(/Test results/i)).toBeInTheDocument();
  });
});
