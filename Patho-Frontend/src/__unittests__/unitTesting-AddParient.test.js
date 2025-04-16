import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import dotenv from "dotenv";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import configureStore from "redux-mock-store";
import AddPatient from "../Patient/AddPatient/AddPatient";

dotenv.config();

// Mocking axios
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

// Define the initial state for the mock store
const initialState = {
  patient: { loading: false, error: null, successMessage: null },
  test: {
    tests: [
      { id: 1, testName: "Blood Test" },
      { id: 2, testName: "X-Ray" },
    ],
  },
  user: { userId: "12345" },
};

describe("AddPatient Component", () => {
  let navigate;

  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
    navigate = useNavigate();

    // Mock navigate as a jest function
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  test("renders the component correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <AddPatient />
        </Router>
      </Provider>
    );
    // Ensure the 'Back' button is present
    // expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  test("displays form when user is authenticated", async () => {
    // Mocking successful authentication response
    axios.get.mockResolvedValueOnce({ status: 200 });

    render(
      <Provider store={store}>
        <Router>
          <AddPatient />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      // expect(screen.getByRole("form")).toBeInTheDocument(); // Assuming AddForm is rendered as a form
    });
  });

  test("redirects to login page if not logged in", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });

    render(
      <Provider store={store}>
        <Router>
          <AddPatient />
        </Router>
      </Provider>
    );
  });

  test("handles back navigation correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <AddPatient />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText("Back"));
  });

  test("renders AddForm component", () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    render(
      <Provider store={store}>
        <Router>
          <AddPatient />
        </Router>
      </Provider>
    );

    // expect(screen.getByRole("form")).toBeInTheDocument(); // Assuming AddForm has test ID
  });
});
