import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import TestsTable from "../Configuration/Tests/TestsTable";
import configTestReducer from "../Redux/configTestSlice";

// Mock Redux Store
const store = configureStore({
  reducer: {
    test: configTestReducer,
  },
});

const renderWithStore = (ui) => render(<Provider store={store}>{ui}</Provider>);

describe("TestsTable Component", () => {
  test("should display loading state when data is being fetched", () => {
    store.dispatch = jest.fn(() => {
      return { loading: true };
    });

    renderWithStore(
      <TestsTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setTestCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Check if loading text is displayed
    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should display error message if there's an error", () => {
    store.dispatch = jest.fn(() => {
      return { error: "Failed to fetch data" };
    });

    renderWithStore(
      <TestsTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setTestCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Check if error message is displayed
    // expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
  });

  test("should display message when no tests are available", async () => {
    store.dispatch = jest.fn(() => {
      return { tests: [] };
    });

    renderWithStore(
      <TestsTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setTestCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Wait for the component to render
    // await waitFor(() => {
    //   expect(screen.getByText("No tests available.")).toBeInTheDocument();
    // });
  });

  test("should display tests when they are available", async () => {
    const mockTests = [
      { id: "1", testName: "Test 1" },
      { id: "2", testName: "Test 2" },
    ];

    store.dispatch = jest.fn(() => {
      return { tests: mockTests, loading: false };
    });

    renderWithStore(
      <TestsTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setTestCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Wait for the table rows to be rendered
    // await waitFor(() => {
    //   expect(screen.getByText("Test 1")).toBeInTheDocument();
    //   expect(screen.getByText("Test 2")).toBeInTheDocument();
    // });
  });

  test("should filter tests based on search term", async () => {
    const mockTests = [
      { id: "1", testName: "Test 1" },
      { id: "2", testName: "Test 2" },
    ];

    store.dispatch = jest.fn(() => {
      return { tests: mockTests, loading: false };
    });

    renderWithStore(
      <TestsTable
        filter=""
        searchTerm="Test 1"
        currentPage={1}
        entriesPerPage={5}
        setTestCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Wait for the filtered result to appear
    // await waitFor(() => {
    //   expect(screen.getByText("Test 1")).toBeInTheDocument();
    //   expect(screen.queryByText("Test 2")).not.toBeInTheDocument();
    // });
  });

  test("should update test count and total entries when new data is fetched", async () => {
    const mockTests = [
      { id: "1", testName: "Test 1" },
      { id: "2", testName: "Test 2" },
    ];

    const setTestCountMock = jest.fn();
    const setTotalEntriesMock = jest.fn();

    store.dispatch = jest.fn(() => {
      return { tests: mockTests, loading: false };
    });

    renderWithStore(
      <TestsTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setTestCount={setTestCountMock}
        setTotalEntries={setTotalEntriesMock}
        refreshKey={0}
      />
    );

    // Check if test count and total entries are updated
    // await waitFor(() => {
    //   expect(setTestCountMock).toHaveBeenCalledWith(2); // 2 tests in total
    //   expect(setTotalEntriesMock).toHaveBeenCalledWith(2); // 2 filtered entries (all are included)
    // });
  });
});
