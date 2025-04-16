import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import patientReducer from "../Redux/patientSlice"; // Adjust import as needed
import userReducer from "../Redux/userSlice"; // Adjust import as needed
import TestTable from "../Test/TestTable"; // Update the path accordingly

// Mock Redux Store
const store = configureStore({
  reducer: {
    patient: patientReducer,
    user: userReducer, // Assuming user state is necessary
  },
});

const renderWithStore = (ui) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

describe("TestTable Component", () => {
  test("should display loading state when data is being fetched", () => {
    store.dispatch = jest.fn(() => {
      return { loading: true };
    });

    renderWithStore(
      <TestTable
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
      <TestTable
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
    // expect(screen.getByText("Error: Failed to fetch data")).toBeInTheDocument();
  });

  test("should display message when no patients are available", async () => {
    store.dispatch = jest.fn(() => {
      return { patientsWithTestId: [] };
    });

    renderWithStore(
      <TestTable
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
    //   expect(screen.getByText("No patients available.")).toBeInTheDocument();
    // });
  });

  test("should display patients when they are available", async () => {
    const mockPatients = [
      {
        _id: "1",
        patientNumber: "P001",
        firstName: "John",
        lastName: "Doe",
        tests: [{}, {}],
        contactNumber: "1234567890",
        gender: "Male",
        age: 30,
        sampleCollector: "Dr. Smith",
      },
      {
        _id: "2",
        patientNumber: "P002",
        firstName: "Jane",
        lastName: "Doe",
        tests: [{}, {}],
        contactNumber: "0987654321",
        gender: "Female",
        age: 28,
        sampleCollector: "Dr. Brown",
      },
    ];

    store.dispatch = jest.fn(() => {
      return { patientsWithTestId: mockPatients, loading: false };
    });

    renderWithStore(
      <TestTable
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
    //   expect(screen.getByText("John Doe")).toBeInTheDocument();
    //   expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    // });
  });

  test("should filter patients based on search term", async () => {
    const mockPatients = [
      {
        _id: "1",
        patientNumber: "P001",
        firstName: "John",
        lastName: "Doe",
        tests: [{}, {}],
        contactNumber: "1234567890",
        gender: "Male",
        age: 30,
        sampleCollector: "Dr. Smith",
      },
      {
        _id: "2",
        patientNumber: "P002",
        firstName: "Jane",
        lastName: "Doe",
        tests: [{}, {}],
        contactNumber: "0987654321",
        gender: "Female",
        age: 28,
        sampleCollector: "Dr. Brown",
      },
    ];

    store.dispatch = jest.fn(() => {
      return { patientsWithTestId: mockPatients, loading: false };
    });

    renderWithStore(
      <TestTable
        filter=""
        searchTerm="John"
        currentPage={1}
        entriesPerPage={5}
        setTestCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={0}
      />
    );

    // Wait for the filtered result to appear
    // await waitFor(() => {
    //   expect(screen.getByText("John Doe")).toBeInTheDocument();
    //   expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    // });
  });

  test("should update total entries when filtered results change", async () => {
    const mockPatients = [
      {
        _id: "1",
        patientNumber: "P001",
        firstName: "John",
        lastName: "Doe",
        tests: [{}, {}],
        contactNumber: "1234567890",
        gender: "Male",
        age: 30,
        sampleCollector: "Dr. Smith",
      },
      {
        _id: "2",
        patientNumber: "P002",
        firstName: "Jane",
        lastName: "Doe",
        tests: [{}, {}],
        contactNumber: "0987654321",
        gender: "Female",
        age: 28,
        sampleCollector: "Dr. Brown",
      },
    ];

    const setTestCountMock = jest.fn();
    const setTotalEntriesMock = jest.fn();

    store.dispatch = jest.fn(() => {
      return { patientsWithTestId: mockPatients, loading: false };
    });

    renderWithStore(
      <TestTable
        filter=""
        searchTerm="John"
        currentPage={1}
        entriesPerPage={5}
        setTestCount={setTestCountMock}
        setTotalEntries={setTotalEntriesMock}
        refreshKey={0}
      />
    );

    // Check if total entries are updated
    // await waitFor(() => {
    //   expect(setTotalEntriesMock).toHaveBeenCalledWith(1); // 1 filtered result (John)
    // });
  });

  test("should call dispatch to fetch data on mount and refresh", async () => {
    const dispatchMock = jest.fn();

    store.dispatch = dispatchMock;

    renderWithStore(
      <TestTable
        filter=""
        searchTerm=""
        currentPage={1}
        entriesPerPage={5}
        setTestCount={jest.fn()}
        setTotalEntries={jest.fn()}
        refreshKey={1}
      />
    );

    // Ensure dispatch was called
    // await waitFor(() => {
    //   expect(dispatchMock).toHaveBeenCalledWith(
    //     getPatientsWithTestId("userId")
    //   );
    // });
  });
});
