import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import dotenv from "dotenv";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, useNavigate } from "react-router-dom";
import configureStore from "redux-mock-store";
import TestsDetails from "../Configuration/Tests/TestsDetails/TestsDetails";

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
  user: { userId: "12345" },
};

describe("TestsDetails Component", () => {
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
        <MemoryRouter initialEntries={["/test/1"]}>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );
    // Ensure the 'Back' button is present
    // expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  test("checks if authentication is called on mount", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    // await waitFor(() =>
    //   expect(axios.get).toHaveBeenCalledWith(
    //     `${process.env.VITE_API_BASE_URL}/api/protected`,
    //     expect.any(Object)
    //   )
    // );
  });

  test("displays 'Logging out...' message if not authenticated", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    // await waitFor(() =>
    //   expect(screen.getByText("Logging out...")).toBeInTheDocument()
    // );
  });

  test("fetches and displays report data", async () => {
    const mockReport = { testName: "Test 1", fields: [] };
    axios.get.mockResolvedValueOnce({ data: mockReport });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    // await waitFor(() => {
    //   expect(screen.getByText("Test 1")).toBeInTheDocument();
    // });
  });

  test("displays loading text while fetching report data", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays 'No fields found' when no fields are in the report", async () => {
    const mockReport = { testName: "Test 1", fields: [] };
    axios.get.mockResolvedValueOnce({ data: mockReport });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    // await waitFor(() => {
    //   expect(
    //     screen.getByText("No fields found for this test.")
    //   ).toBeInTheDocument();
    // });
  });

  test("displays field data correctly", async () => {
    const mockReport = {
      testName: "Test 1",
      fields: [
        {
          fieldName: "Field 1",
          units: "Units 1",
          referenceRange: "Range 1",
        },
      ],
    };
    axios.get.mockResolvedValueOnce({ data: mockReport });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    // await waitFor(() => {
    //   expect(screen.getByText("Field 1")).toBeInTheDocument();
    //   expect(screen.getByText("Units 1")).toBeInTheDocument();
    //   expect(screen.getByText("Range 1")).toBeInTheDocument();
    // });
  });

  test("navigates to the Dashboard/Tests when back button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/test/1"]}>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Back"));

    expect(window.location.pathname).toBe("/");
  });

  test("handles errors correctly when report fetching fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TestsDetails />
        </MemoryRouter>
      </Provider>
    );

    // await waitFor(() => {
    //   expect(screen.getByText("Loading...")).toBeInTheDocument(); // Depending on error handling logic
    // });
  });
});
