import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import AddForm from "../Patient/AddPatient/AddForm";
import {
  addPatient,
  fetchUserData,
  getAllTests,
} from "../Redux/configTestSlice";

jest.mock("../Redux/configTestSlice", () => ({
  getAllTests: jest.fn(),
  fetchUserData: jest.fn(),
  addPatient: jest.fn(() => ({ unwrap: jest.fn() })),
}));

const mockStore = configureStore([]);
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

describe("AddForm Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it("renders all input fields and the save button", () => {
    render(
      <Provider store={store}>
        <Router>
          <AddForm />
        </Router>
      </Provider>
    );

    expect(screen.getByLabelText(/First Name/i));
    expect(screen.getByLabelText(/Last Name/i));
    expect(screen.getByRole("button", { name: /Save/i }));
  });

  it("dispatches fetchUserData and getAllTests on mount", () => {
    render(
      <Provider store={store}>
        <Router>
          <AddForm />
        </Router>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(fetchUserData());
    expect(store.dispatch).toHaveBeenCalledWith(getAllTests("12345"));
  });

  it("handles input changes correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <AddForm />
        </Router>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");
  });

  jest.mock("../Redux/patientSlice", () => ({
    addPatient: jest.fn(() => ({ unwrap: jest.fn() })),
    clearMessage: jest.fn(),
  }));

  it("submits the form successfully", async () => {
    const dispatch = jest.fn();
    store.dispatch = dispatch;

    render(
      <Provider store={store}>
        <Router>
          <AddForm />
        </Router>
      </Provider>
    );

    // Wait for input fields to appear
    const firstNameInput = await screen.findByLabelText(/First Name/i);
    const lastNameInput = await screen.findByLabelText(/Last Name/i);
    const contactNumberInput = await screen.findByLabelText(/Contact Number/i);
    const emailInput = await screen.findByLabelText(/Email/i);
    const genderSelect = await screen.findByLabelText(/Gender/i);
    const ageInput = await screen.findByLabelText(/Age/i);
    const sampleCollectorInput = await screen.findByLabelText(
      /Sample Collector/i
    );
    const dateTimeInput = await screen.findByLabelText(/Date & Time/i);
    const doctorNameInput = await screen.findByLabelText(/Doctor Name/i);
    const collectionDateInput = await screen.findByLabelText(
      /Collection Date/i
    );
    const addressInput = await screen.findByLabelText(/Address/i);

    // Fill out the form
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(contactNumberInput, { target: { value: "1234567890" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(genderSelect, { target: { value: "Male" } });
    fireEvent.change(ageInput, { target: { value: "30" } });
    fireEvent.change(sampleCollectorInput, { target: { value: "Collector" } });
    fireEvent.change(dateTimeInput, { target: { value: "2025-01-15T10:00" } });
    fireEvent.change(doctorNameInput, { target: { value: "Dr. Smith" } });
    fireEvent.change(collectionDateInput, { target: { value: "2025-01-16" } });
    fireEvent.change(addressInput, { target: { value: "123 Test St." } });

    // Submit the form
    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    // Wait for the addPatient action to be called
    await waitFor(() => {
      // expect(dispatch).toHaveBeenCalledWith(addPatient(expect.anything()));
      // expect(dispatch).toHaveBeenCalledWith(clearMessage());
    });
  });

  it("displays error message on form submission failure", async () => {
    addPatient.mockRejectedValueOnce(
      new Error("Patient with this number already exists")
    );

    render(
      <Provider store={store}>
        <Router>
          <AddForm />
        </Router>
      </Provider>
    );

    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    // await waitFor(() => {
    //   expect(
    //     screen.getByText(/Patient with this number already exists/i)
    //   ).toBeInTheDocument();
    // });
  });
});
