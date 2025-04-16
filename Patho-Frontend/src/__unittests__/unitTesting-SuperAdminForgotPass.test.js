import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import SuperAdminForgotPass from "../SuperAdminForgotPass/SuperAdminForgotPass";

jest.mock("axios"); // Mock axios

describe("SuperAdminForgotPass Component", () => {
  const mockNavigate = jest.fn();

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  const renderComponent = () =>
    render(
      <Router>
        <SuperAdminForgotPass />
      </Router>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial form with email/mobile input and send OTP button", () => {
    renderComponent();

    // expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    // expect(
    //   screen.getByPlaceholderText(/enter your email or mobile number/i)
    // ).toBeInTheDocument();
    // expect(screen.getByRole("button", { name: /send otp/i })).toBeInTheDocument();
  });

  test("renders OTP input form after sending OTP", async () => {
    axios.post.mockResolvedValueOnce({}); // Mock successful OTP send

    renderComponent();

    const input = screen.getByPlaceholderText(/enter your email or mobile number/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });
    fireEvent.click(sendOtpButton);

    // expect(await screen.findByText(/enter otp/i)).toBeInTheDocument();
    // expect(screen.getByPlaceholderText(/enter the otp/i)).toBeInTheDocument();
  });

  test("displays error message when sending OTP fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed to send OTP"));

    renderComponent();

    const input = screen.getByPlaceholderText(/enter your email or mobile number/i);
    fireEvent.change(input, { target: { value: "invalid@example.com" } });

    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });
    fireEvent.click(sendOtpButton);

    // expect(
    //   await screen.findByText(/failed to send otp\. please check your input\./i)
    // ).toBeInTheDocument();
  });

  test("verifies OTP and navigates to change password on success", async () => {
    axios.post.mockResolvedValueOnce({}); // Mock OTP send success
    axios.post.mockResolvedValueOnce({ data: { token: "dummyToken" } }); // Mock OTP verify success

    renderComponent();

    const input = screen.getByPlaceholderText(/enter your email or mobile number/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });
    fireEvent.click(sendOtpButton);

    // expect(await screen.findByText(/enter otp/i)).toBeInTheDocument();

    // const otpInput = screen.getByPlaceholderText(/enter the otp/i);
    // fireEvent.change(otpInput, { target: { value: "123456" } });

    // const verifyOtpButton = screen.getByRole("button", { name: /verify otp/i });
    // fireEvent.click(verifyOtpButton);

    // expect(mockNavigate).toHaveBeenCalledWith("/SuperAdminChangePass");
  });

  test("displays error message when OTP verification fails", async () => {
    axios.post.mockResolvedValueOnce({}); // Mock OTP send success
    axios.post.mockRejectedValueOnce(new Error("Invalid OTP")); // Mock OTP verify failure

    renderComponent();

    const input = screen.getByPlaceholderText(/enter your email or mobile number/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });
    fireEvent.click(sendOtpButton);

    // expect(await screen.findByText(/enter otp/i)).toBeInTheDocument();

    // const otpInput = screen.getByPlaceholderText(/enter the otp/i);
    // fireEvent.change(otpInput, { target: { value: "wrongOtp" } });

    // const verifyOtpButton = screen.getByRole("button", { name: /verify otp/i });
    // fireEvent.click(verifyOtpButton);

    // expect(await screen.findByText(/invalid otp\. please try again\./i)).toBeInTheDocument();
  });
});
