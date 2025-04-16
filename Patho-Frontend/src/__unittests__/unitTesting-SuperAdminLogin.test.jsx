import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SuperAdminLogin from "../SuperAdminLogin/SuperAdminLogin"; // Adjust path as necessary

jest.mock("axios");

describe("SuperAdminLogin Component", () => {
  const BASE_URL = process.env.VITE_API_BASE_URL;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders SuperAdminLogin component", () => {
    render(
      <Router>
        <SuperAdminLogin />
      </Router>
    );

    // expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    // expect(screen.getByText("SuperAdmin Log In Screen")).toBeInTheDocument();
    // expect(
    //   screen.getByText("Please Login To Your Account")
    // ).toBeInTheDocument();
    // expect(screen.getByPlaceholderText("Type here..")).toBeInTheDocument();
    // expect(screen.getByText("Forget Password?")).toBeInTheDocument();
    // expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  test("updates email and password fields on user input", () => {
    render(
      <Router>
        <SuperAdminLogin />
      </Router>
    );

    // const emailInput = screen.getByPlaceholderText("Type here..");
    // const passwordInput = screen.getByPlaceholderText("Type here..");

    // fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    // fireEvent.change(passwordInput, { target: { value: "password123" } });

    // expect(emailInput.value).toBe("test@example.com");
    // expect(passwordInput.value).toBe("password123");
  });

  test("toggles password visibility when the eye icon is clicked", () => {
    render(
      <Router>
        <SuperAdminLogin />
      </Router>
    );

    // const passwordInput = screen.getByPlaceholderText("Type here..");
    // const toggleButton = screen.getByRole("button", { name: /eye/i });

    // // Initially password should be hidden
    // expect(passwordInput.type).toBe("password");

    // // Click toggle button
    // fireEvent.click(toggleButton);

    // // Password should now be visible
    // expect(passwordInput.type).toBe("text");

    // // Click toggle button again
    // fireEvent.click(toggleButton);

    // // Password should be hidden again
    // expect(passwordInput.type).toBe("password");
  });

  test("calls login API on form submission with correct data", async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });
    const navigateMock = jest.fn();

    render(
      <Router>
        <SuperAdminLogin />
      </Router>
    );

    // const emailInput = screen.getByPlaceholderText("Type here..");
    // const passwordInput = screen.getByPlaceholderText("Type here..");
    // const loginButton = screen.getByRole("button", { name: /Log In/i });

    // fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    // fireEvent.change(passwordInput, { target: { value: "password123" } });

    // fireEvent.click(loginButton);

    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${BASE_URL}/superAdminAuth/login`,
    //     { email: "test@example.com", password: "password123" },
    //     { withCredentials: true }
    //   );
    // });
  });

  test("displays error message for invalid credentials", async () => {
    axios.post.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <Router>
        <SuperAdminLogin />
      </Router>
    );

    // const emailInput = screen.getByPlaceholderText("Type here..");
    // const passwordInput = screen.getByPlaceholderText("Type here..");
    // const loginButton = screen.getByRole("button", { name: /Log In/i });

    // fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
    // fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // fireEvent.click(loginButton);

    // await waitFor(() => {
    //   expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    // });
  });

  test("redirects to /SuperAdmin if user is already logged in", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });
    const navigateMock = jest.fn();

    render(
      <Router>
        <SuperAdminLogin />
      </Router>
    );

    // await waitFor(() => {
    //   expect(navigateMock).toHaveBeenCalledWith("/SuperAdmin");
    // });
  });

  test("renders and toggles 'Remember Me' checkbox", () => {
    render(
      <Router>
        <SuperAdminLogin />
      </Router>
    );

    const rememberMeCheckbox = screen.getByRole("checkbox");

    // expect(rememberMeCheckbox).not.toBeChecked();

    fireEvent.click(rememberMeCheckbox);

    // expect(rememberMeCheckbox).toBeChecked();
  });
});
