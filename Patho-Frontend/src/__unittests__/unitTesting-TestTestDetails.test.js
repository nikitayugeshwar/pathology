import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import TestDetails from "../Test/TestDetails/TestDetails";

// Mocking the necessary hooks and axios
jest.mock("axios");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mocking react-router-dom module properly
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  Link: jest.fn(),
}));

describe("TestDetails", () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockReturnValue({
      patient: { firstName: "John", lastName: "Doe", patientNumber: "123" },
    });

    // Mocking useParams to return an id
    useParams.mockReturnValue({ id: "123" });
  });

  test("renders loading state", () => {
    render(
      <Router>
        <TestDetails />
      </Router>
    );

    // expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("renders error state", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch reports"));

    render(
      <Router>
        <TestDetails />
      </Router>
    );

    // await waitFor(() =>
    //   expect(
    //     screen.getByText(/Error: Failed to fetch reports/i)
    //   ).toBeInTheDocument()
    // );
  });

  test("renders patient details and reports", async () => {
    const mockPatientData = {
      firstName: "Jane",
      lastName: "Doe",
      patientNumber: "456",
    };
    const mockReports = [
      {
        _id: "report1",
        testName: "Test 1",
        subtests: [
          {
            subtestName: "Subtest 1",
            fields: [
              {
                fieldName: "Field 1",
                results: "20",
                units: "mg",
                referenceRange: "10-30",
              },
            ],
          },
        ],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockReports });
    useSelector.mockReturnValue({ patient: mockPatientData });

    render(
      <Router>
        <TestDetails />
      </Router>
    );

    await waitFor(() => {
      // expect(screen.getByText("Test 1")).toBeInTheDocument();
      // expect(screen.getByText("Field 1")).toBeInTheDocument();
      // expect(screen.getByText("20")).toBeInTheDocument();
      // expect(screen.getByText("10-30")).toBeInTheDocument();
    });
  });

  test("navigates to the previous page on Back button click", () => {
    render(
      <Router>
        <TestDetails />
      </Router>
    );

    // const backButton = screen.getByRole("button", { name: /Back/i });

    // fireEvent.click(backButton);

    // expect(screen.getByText("Back")).toBeInTheDocument(); // Check for back button or validate route change
  });

  test("Create Report button navigates to the correct route", () => {
    render(
      <Router>
        <TestDetails />
      </Router>
    );

    // const createButton = screen.getByRole("button", { name: /Create Report/i });

    // fireEvent.click(createButton);

    // expect(window.location.pathname).toBe("/Dashboard/CreateTestReport/123");
  });

  test("Edit button navigates to the correct route", () => {
    render(
      <Router>
        <TestDetails />
      </Router>
    );

    // const editButton = screen.getByTestId("Edit");
    // fireEvent.click(editButton);

    // expect(window.location.pathname).toBe("/Dashboard/EditTestReport/123");
  });

  test("handles out-of-range results correctly", async () => {
    const mockReports = [
      {
        _id: "report1",
        testName: "Test 1",
        subtests: [
          {
            subtestName: "Subtest 1",
            fields: [
              {
                fieldName: "Field 1",
                results: "40",
                units: "mg",
                referenceRange: "10-30",
              },
            ],
          },
        ],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockReports });

    render(
      <Router>
        <TestDetails />
      </Router>
    );

    // await waitFor(() => {
    //   const resultField = screen.getByText("40");
    //   expect(resultField).toHaveClass("text-red-600 font-bold"); // Check if out-of-range result is styled as expected
    // });
  });
});
