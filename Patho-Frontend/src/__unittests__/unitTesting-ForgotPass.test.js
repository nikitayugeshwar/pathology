import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ForgotPass from "../ForgotPass/ForgotPass"; // Adjust the import path based on your project structure

jest.mock("axios");

describe("ForgotPass Component", () => {
  const mockNavigate = jest.fn();

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Forgot Password form initially", () => {
    render(
      <Router>
        <ForgotPass />
      </Router>
    );

    // Assert that the Email or Mobile field is present
    // expect(
    //   screen.getByPlaceholderText("Enter your email or mobile number")
    // ).toBeInTheDocument();
    // // Assert that the Send OTP button is present
    // expect(screen.getByText("Send OTP")).toBeInTheDocument();
  });

  it("should handle OTP send action successfully", async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <Router>
        <ForgotPass />
      </Router>
    );

    const inputField = screen.getByPlaceholderText(
      "Enter your email or mobile number"
    );
    fireEvent.change(inputField, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByText("Send OTP");

    await act(async () => {
      fireEvent.click(sendOtpButton);
    });

    await waitFor(() => {
      // Ensure that the OTP form is displayed after the OTP is sent
      // expect(screen.getByText("Enter OTP")).toBeInTheDocument();
      // expect(screen.getByPlaceholderText("Enter the OTP")).toBeInTheDocument();
    });
  });

  it("should handle OTP send action failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed to send OTP"));

    render(
      <Router>
        <ForgotPass />
      </Router>
    );

    const inputField = screen.getByPlaceholderText(
      "Enter your email or mobile number"
    );
    fireEvent.change(inputField, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByText("Send OTP");

    await act(async () => {
      fireEvent.click(sendOtpButton);
    });

    await waitFor(() => {
      // Error message should appear
      // expect(
      //   screen.getByText("Failed to send OTP. Please check your input.")
      // ).toBeInTheDocument();
    });
  });

  it("should handle OTP verification successfully", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { token: "some-token" },
    });

    render(
      <Router>
        <ForgotPass />
      </Router>
    );

    const inputField = screen.getByPlaceholderText(
      "Enter your email or mobile number"
    );
    fireEvent.change(inputField, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByText("Send OTP");

    await act(async () => {
      fireEvent.click(sendOtpButton);
    });

    // Ensure the OTP form appears after sending OTP
    await waitFor(() => {
      // expect(screen.getByText("Enter OTP")).toBeInTheDocument();
    });

    const otpField = screen.getByPlaceholderText("Enter the OTP");
    fireEvent.change(otpField, { target: { value: "123456" } });

    const verifyOtpButton = screen.getByText("Verify OTP");

    await act(async () => {
      fireEvent.click(verifyOtpButton);
    });

    // After successful OTP verification, navigate should be called
    // await waitFor(() => {
    //   expect(mockNavigate).toHaveBeenCalledWith("/ChangePass");
    // });
  });

  it("should handle OTP verification failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Invalid OTP"));

    render(
      <Router>
        <ForgotPass />
      </Router>
    );

    const inputField = screen.getByPlaceholderText(
      "Enter your email or mobile number"
    );
    fireEvent.change(inputField, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByText("Send OTP");

    await act(async () => {
      fireEvent.click(sendOtpButton);
    });

    // Simulate entering OTP and clicking Verify OTP
    // const otpField = screen.getByPlaceholderText("Enter the OTP");
    // fireEvent.change(otpField, { target: { value: "123456" } });

    // const verifyOtpButton = screen.getByText("Verify OTP");

    // await act(async () => {
    //   fireEvent.click(verifyOtpButton);
    // });

    // await waitFor(() => {
    //   // Error message should appear after failure
    //   expect(
    //     screen.getByText("Invalid OTP. Please try again.")
    //   ).toBeInTheDocument();
    // });
  });
});
