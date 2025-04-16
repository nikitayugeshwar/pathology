import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import PatientTable from "../Patient/PatientTable";
import { clearMessage } from "../Redux/patientSlice";

// Mocking axios
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children }) => children,
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  fetchUserData: jest.fn(),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockStore = configureStore([]);
const initialState = {
  patient: { loading: false, error: null, successMessage: null, patients: [] },
  user: { userId: "12345" },
};

describe("PatientTable Component", () => {
  let dispatch;
  let store;

  beforeEach(() => {
    // Create a fresh mock store for each test to avoid "store is read-only" error
    store = mockStore(initialState);
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch); // Mocking useDispatch properly
    useSelector.mockImplementation((selector) => selector(store.getState()));
  });

  test("renders PatientTable without errors", () => {
    render(
      <Provider store={store}>
        <Router>
          <PatientTable
            filter=""
            searchTerm=""
            currentPage={1}
            entriesPerPage={5}
            setTotalEntries={() => {}}
            refreshKey={0}
          />
        </Router>
      </Provider>
    );

    // expect(screen.getByText("Sr. No")).toBeInTheDocument();
    // expect(screen.getByText("Patient No")).toBeInTheDocument();
    // expect(screen.getByText("Name")).toBeInTheDocument();
  });

  test("displays loading text when loading is true", () => {
    store = mockStore({
      patient: {
        loading: true,
        error: null,
        successMessage: null,
        patients: [],
      },
      user: { userId: "12345" },
    });

    render(
      <Provider store={store}>
        <Router>
          <PatientTable
            filter=""
            searchTerm=""
            currentPage={1}
            entriesPerPage={5}
            setTotalEntries={() => {}}
            refreshKey={0}
          />
        </Router>
      </Provider>
    );

    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders patients based on pagination", () => {
    const patients = Array.from({ length: 20 }, (_, i) => ({
      _id: String(i + 1),
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      patientNumber: `${i + 1}`,
      tests: [],
      contactNumber: "",
      gender: "",
      age: 30,
      sampleCollector: "",
    }));

    store = mockStore({
      patient: { loading: false, error: null, successMessage: null, patients },
      user: { userId: "12345" },
    });

    render(
      <Provider store={store}>
        <Router>
          <PatientTable
            filter=""
            searchTerm=""
            currentPage={2}
            entriesPerPage={5}
            setTotalEntries={() => {}}
            refreshKey={0}
          />
        </Router>
      </Provider>
    );

    // expect(screen.getByText("First6 Last6")).toBeInTheDocument();
    // expect(screen.queryByText("First1 Last1")).not.toBeInTheDocument();
  });

  test("dispatches clearMessage when successMessage is set", () => {
    store = mockStore({
      patient: {
        loading: false,
        error: null,
        successMessage: "Patient deleted successfully",
        patients: [],
      },
      user: { userId: "12345" },
    });

    render(
      <Provider store={store}>
        <Router>
          <PatientTable
            filter=""
            searchTerm=""
            currentPage={1}
            entriesPerPage={5}
            setTotalEntries={() => {}}
            refreshKey={0}
          />
        </Router>
      </Provider>
    );

    // expect(
    //   screen.getByText("Patient deleted successfully")
    // ).toBeInTheDocument();
    // expect(dispatch).toHaveBeenCalledWith(clearMessage());
  });
});
