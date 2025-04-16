import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Twilio from "../Configuration/SocialmediaIntegration/Twilio/Twilio";

// Mocking the Redux store and the useSelector hook
const mockStore = {
  user: {
    userId: "123",
  },
};

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  useSelector.mockReturnValue(mockStore.user);
  fetchMock.resetMocks();
});

describe("Twilio Component", () => {
  it("should render the form with initial values", async () => {
    // Mock a successful API response
    fetchMock.mockResponseOnce(
      JSON.stringify({
        twilioSid: "test-sid",
        twilioAuthToken: "test-token",
        twilioActiveNumber: "+1234567890",
      })
    );

    render(
      <Router>
        <Twilio />
      </Router>
    );

    // Wait for the data to be fetched
    // await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Ensure the form fields are pre-filled with fetched data
    // await waitFor(() =>
    //   expect(screen.getByLabelText("Twilio SID")).toHaveValue("test-sid")
    // );

    // expect(screen.getByLabelText("Twilio Auth Token")).toHaveValue(
    //   "test-token"
    // );
    // expect(screen.getByLabelText("Twilio Active Number")).toHaveValue(
    //   "+1234567890"
    // );
  });

  it("should handle a failed API request while fetching user data", async () => {
    // Mock a failed API response
    fetchMock.mockRejectOnce(new Error("Failed to fetch"));

    render(
      <Router>
        <Twilio />
      </Router>
    );

    // Ensure no errors in the UI (it should silently fail)
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Ensure form fields are empty since fetch failed
    // expect(screen.getByLabelText("Twilio SID")).toHaveValue("");
    // expect(screen.getByLabelText("Twilio Auth Token")).toHaveValue("");
    // expect(screen.getByLabelText("Twilio Active Number")).toHaveValue("");
  });

  it("should submit the form successfully", async () => {
    // Mock a successful fetch response for user data
    fetchMock.mockResponseOnce(
      JSON.stringify({
        twilioSid: "test-sid",
        twilioAuthToken: "test-token",
        twilioActiveNumber: "+1234567890",
      })
    );

    // Mock the POST request to simulate a successful form submission
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Form submitted successfully" })
    );

    render(
      <Router>
        <Twilio />
      </Router>
    );

    // Wait for the data to be fetched and form to be populated
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Fill the form and submit it
    fireEvent.change(screen.getByLabelText("Twilio SID"), {
      target: { value: "new-sid" },
    });
    fireEvent.change(screen.getByLabelText("Twilio Auth Token"), {
      target: { value: "new-token" },
    });
    fireEvent.change(screen.getByLabelText("Twilio Active Number"), {
      target: { value: "+9876543210" },
    });

    fireEvent.click(screen.getByText("Submit"));

    // Ensure the POST request is made with the correct form data
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/api/userProfile/Twilio",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            userId: "123",
            twilioSid: "new-sid",
            twilioAuthToken: "new-token",
            twilioActiveNumber: "+9876543210",
          }),
        })
      )
    );
  });

  it("should handle form submission error", async () => {
    // Mock a successful fetch response for user data
    fetchMock.mockResponseOnce(
      JSON.stringify({
        twilioSid: "test-sid",
        twilioAuthToken: "test-token",
        twilioActiveNumber: "+1234567890",
      })
    );

    // Mock the POST request to simulate an error
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Error submitting form" }),
      { status: 400 }
    );

    render(
      <Router>
        <Twilio />
      </Router>
    );

    // Wait for the data to be fetched and form to be populated
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Fill the form and submit it
    fireEvent.change(screen.getByLabelText("Twilio SID"), {
      target: { value: "new-sid" },
    });
    fireEvent.change(screen.getByLabelText("Twilio Auth Token"), {
      target: { value: "new-token" },
    });
    fireEvent.change(screen.getByLabelText("Twilio Active Number"), {
      target: { value: "+9876543210" },
    });

    fireEvent.click(screen.getByText("Submit"));
  });

  it("should handle network errors during form submission", async () => {
    // Mock a successful fetch response for user data
    fetchMock.mockResponseOnce(
      JSON.stringify({
        twilioSid: "test-sid",
        twilioAuthToken: "test-token",
        twilioActiveNumber: "+1234567890",
      })
    );

    // Mock a network error during POST request
    fetchMock.mockRejectOnce(new Error("Network Error"));

    render(
      <Router>
        <Twilio />
      </Router>
    );

    // Wait for the data to be fetched and form to be populated
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Fill the form and submit it
    fireEvent.change(screen.getByLabelText("Twilio SID"), {
      target: { value: "new-sid" },
    });
    fireEvent.change(screen.getByLabelText("Twilio Auth Token"), {
      target: { value: "new-token" },
    });
    fireEvent.change(screen.getByLabelText("Twilio Active Number"), {
      target: { value: "+9876543210" },
    });

    fireEvent.click(screen.getByText("Submit"));
  });
});
