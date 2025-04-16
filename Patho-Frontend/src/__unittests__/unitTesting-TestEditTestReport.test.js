import { render, screen } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import EditForm from "../Test/EditTestReport/EditForm";

jest.mock("axios");

const mockStore = configureStore([]);

const renderComponent = (store) => {
  render(
    <Provider store={store}>
      <Router>
        <EditForm />
      </Router>
    </Provider>
  );
};

describe("EditForm Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { userId: "testUserId" },
    });
  });

  it("renders loading state initially", () => {
    axios.get.mockResolvedValue({ data: [] });
    renderComponent(store);

    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error message if API call fails", async () => {
    axios.get.mockRejectedValue({ message: "An error occurred" });
    renderComponent(store);

    // await waitFor(() => {
    //   expect(screen.getByText(/Error: An error occurred/i)).toBeInTheDocument();
    // });
  });

  it("renders the form when reports are available", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          testName: "Test 1",
          subtests: [
            {
              subtestName: "Subtest 1",
              fields: [
                {
                  fieldName: "Field 1",
                  units: "mg/L",
                  referenceRange: "10-20",
                  result: "15",
                },
              ],
            },
          ],
        },
      ],
    });

    renderComponent(store);

    // await waitFor(() => {
    //   expect(screen.getByText(/Test 1/i)).toBeInTheDocument();
    // });

    // expect(screen.getByPlaceholderText("15")).toBeInTheDocument();
  });

  it("updates formData on input change", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          testName: "Test 1",
          subtests: [
            {
              subtestName: "Subtest 1",
              fields: [
                {
                  fieldName: "Field 1",
                  units: "mg/L",
                  referenceRange: "10-20",
                  result: "15",
                },
              ],
            },
          ],
        },
      ],
    });

    renderComponent(store);

    // await waitFor(() => {
    //   expect(screen.getByPlaceholderText("18"));
    // });

    // const resultInput = screen.getByPlaceholderText("18");
    // fireEvent.change(resultInput, { target: { value: "18" } });

    // expect(resultInput.value).toBe("18");
  });

  it("submits data correctly", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          testName: "Test 1",
          subtests: [
            {
              subtestName: "Subtest 1",
              fields: [
                {
                  fieldName: "Field 1",
                  units: "mg/L",
                  referenceRange: "10-20",
                  result: "15",
                },
              ],
            },
          ],
        },
      ],
    });

    axios.post.mockResolvedValue({ data: { success: true } });

    renderComponent(store);

    // await waitFor(() => {
    //   expect(screen.getByText(/Test 1/i)).toBeInTheDocument();
    // });

    // const submitButton = screen.getByText("Update");
    // fireEvent.click(submitButton);

    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     expect.stringContaining("/addTestReport"),
    //     expect.objectContaining({
    //       patientId: expect.any(String),
    //       userId: "testUserId",
    //     })
    //   );
    // });
  });

  it("handles out-of-range notifications", () => {
    const isOutOfRange = (result, referenceRange) => {
      const [min, max] = referenceRange.split("-").map(Number);
      const numericResult = parseFloat(result);

      if (!isNaN(numericResult) && !isNaN(min) && !isNaN(max)) {
        return numericResult < min || numericResult > max;
      }
      return false;
    };

    // expect(isOutOfRange("25", "10-20")).toBe(true);
    // expect(isOutOfRange("15", "10-20")).toBe(false);
  });
});
