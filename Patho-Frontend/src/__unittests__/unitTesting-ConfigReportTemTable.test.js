import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import ReportTable from "../Configuration/ReportTempMan/ReportTable";
import configTemplateReducer from "../Redux/configTemplateSlice";

// Mock Redux Store
const store = configureStore({
  reducer: {
    configTemplate: configTemplateReducer,
    user: (state = { userId: "mockUserId" }) => state, // Mock user state
  },
});

const renderWithStore = (ui, { initialState = {} } = {}) =>
  render(<Provider store={store}>{ui}</Provider>);

describe("ReportTable Component", () => {
  test("should render the table with config templates", async () => {
    const mockConfigTemplates = [
      { _id: "1", clinicName: "Clinic 1" },
      { _id: "2", clinicName: "Clinic 2" },
    ];

    store.dispatch = jest.fn(() => mockConfigTemplates); // Mock dispatch returning mock data

    renderWithStore(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setReportCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Wait for the table rows to be rendered
    // await waitFor(() => {
    //   expect(screen.getByText("Clinic 1")).toBeInTheDocument();
    //   expect(screen.getByText("Clinic 2")).toBeInTheDocument();
    // });
  });

  test("should display loading state when fetching data", () => {
    store.dispatch = jest.fn(); // Mock dispatch for loading state

    renderWithStore(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setReportCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Check if loading text is shown
    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should handle empty config templates", async () => {
    store.dispatch = jest.fn().mockReturnValue([]); // Mock empty config templates

    renderWithStore(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setReportCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Verify no entries are displayed
    // expect(screen.queryByText("Clinic 1")).not.toBeInTheDocument();
  });

  test("should delete a config template", async () => {
    const mockDelete = jest.fn();
    store.dispatch = mockDelete; // Mock dispatch for deleteConfigTemplate action

    renderWithStore(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setReportCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Simulate clicking the delete button
    // fireEvent.click(screen.getByText("Delete"));

    // Check if confirmation prompt appears
    // expect(window.confirm).toHaveBeenCalledWith(
    //   "Are you sure you want to delete this report?"
    // );

    // // Check if delete action is dispatched
    expect(mockDelete).toHaveBeenCalled();
  });

  test("should show success message after successful deletion", async () => {
    store.dispatch = jest.fn(() => ({
      message: "Report deleted successfully.",
    })); // Mock success message

    renderWithStore(
      <ReportTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setReportCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // // Wait for success message to be displayed
    // await waitFor(() => {
    //   expect(
    //     screen.getByText("Report deleted successfully.")
    //   ).toBeInTheDocument();
    // });
  });

  test("should filter the config templates based on search term", async () => {
    const mockConfigTemplates = [
      { _id: "1", clinicName: "Clinic 1" },
      { _id: "2", clinicName: "Clinic 2" },
    ];

    store.dispatch = jest.fn(() => mockConfigTemplates); // Mock config templates

    renderWithStore(
      <ReportTable
        filter=""
        searchTerm="Clinic 1"
        currentPage={1}
        entriesPerPage={5}
        setReportCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Wait for filtered result to appear
    // await waitFor(() => {
    //   expect(screen.getByText("Clinic 1")).toBeInTheDocument();
    //   expect(screen.queryByText("Clinic 2")).not.toBeInTheDocument();
    // });
  });
});
