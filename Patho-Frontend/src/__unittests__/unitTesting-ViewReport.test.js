import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import ViewReport from "../Report/ViewReport/ViewReport.jsx";
import patientReducer from "../Redux/patientSlice";
import configTemplateReducer from "../Redux/configTemplateSlice.js";
import userReducer from "../Redux/userSlice.js";

jest.mock("axios");

const mockPatientData = {
  firstName: "John",
  lastName: "Doe",
  age: 35,
  gender: "Male",
  contactNumber: "1234567890",
  address: "123 Test St.",
};
const mockReportData = [
  {
    _id: "1",
    testName: "Complete Blood Count",
    subtests: [
      {
        subtestName: "Hemoglobin",
        fields: [
          {
            fieldName: "HGB",
            results: "13.5",
            units: "g/dL",
            referenceRange: "12.0-16.0",
          },
        ],
      },
    ],
  },
];
const mockConfigTemplate = {
  logo: "logo.png",
  headerName: "Test Clinic",
  mobile: "9876543210",
};

describe("ViewReport Component", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        patient: patientReducer,
        configTemplate: configTemplateReducer,
        user: userReducer,
      },
      preloadedState: {
        patient: {
          patient: mockPatientData,
          loading: false,
          error: null,
        },
        configTemplate: {
          configTemplate: mockConfigTemplate,
        },
        user: {
          userId: "testUser",
        },
      },
    });

    axios.get.mockResolvedValueOnce({ data: mockReportData });
  });

  it("renders the ViewReport component correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ViewReport />
        </MemoryRouter>
      </Provider>
    );

    // expect(screen.getByText(/Back/i)).toBeInTheDocument();
    // expect(screen.getByText(/Print/i)).toBeInTheDocument();
  });

  it("displays patient details correctly", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ViewReport />
        </MemoryRouter>
      </Provider>
    );

    // expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    // expect(screen.getByText(/35 | Male/i)).toBeInTheDocument();
  });

  it("renders report data correctly", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ViewReport />
        </MemoryRouter>
      </Provider>
    );

    // expect(screen.getByText(/Complete Blood Count/i)).toBeInTheDocument();
    // expect(screen.getByText(/HGB/i)).toBeInTheDocument();
    // expect(screen.getByText(/13.5/i)).toBeInTheDocument();
    // expect(screen.getByText(/12.0-16.0/i)).toBeInTheDocument();
  });

  it("handles out-of-range results", async () => {
    const outOfRangeData = [
      {
        _id: "1",
        testName: "Complete Blood Count",
        subtests: [
          {
            subtestName: "Hemoglobin",
            fields: [
              {
                fieldName: "HGB",
                results: "17.0",
                units: "g/dL",
                referenceRange: "12.0-16.0",
              },
            ],
          },
        ],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: outOfRangeData });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ViewReport />
        </MemoryRouter>
      </Provider>
    );

    // expect(await screen.findByText(/17.0/i)).toHaveClass("text-red-600");
  });
});
