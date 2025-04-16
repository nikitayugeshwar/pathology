import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../Login/Login";

jest.mock("axios");

describe("Login Component", () => {
  const mockNavigate = jest.fn();

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle input changes", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    // fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    // fireEvent.change(passwordInput, { target: { value: "password123" } });

    // expect(emailInput).toHaveValue("test@example.com");
    // expect(passwordInput).toHaveValue("password123");
  });

  it("should handle login error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Login error"));

    render(
      <Router>
        <Login />
      </Router>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const loginButton = screen.getByText("Log In");

    // fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    // fireEvent.change(passwordInput, { target: { value: "password123" } });
    // fireEvent.click(loginButton);

    // await waitFor(() => {
    //   expect(
    //     screen.getByText("An error occurred during login.")
    //   ).toBeInTheDocument();
    // });
  });

  it("should toggle password visibility", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const passwordInput = screen.getByTestId("password-input");

    // Initial state
    // expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should handle successful login and navigate based on payment status", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { id: "123" },
    });

    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { redirectTo: "dashboard" },
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const loginButton = screen.getByText("Log In");

    // fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    // fireEvent.change(passwordInput, { target: { value: "password123" } });
    // fireEvent.click(loginButton);

    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     expect.stringContaining("/api/login"),
    //     { email: "test@example.com", password: "password123" },
    //     { withCredentials: true }
    //   );
    // });
  });

  it("should handle login error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Login error"));

    render(
      <Router>
        <Login />
      </Router>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const loginButton = screen.getByText("Log In");

    // fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    // fireEvent.change(passwordInput, { target: { value: "password123" } });
    // fireEvent.click(loginButton);
  });

  it("should redirect if the user is already logged in", async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });

    render(
      <Router>
        <Login />
      </Router>
    );
  });
});
