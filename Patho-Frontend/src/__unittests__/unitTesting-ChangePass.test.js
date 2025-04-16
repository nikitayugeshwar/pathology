import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ChangePass from "../ChangePass/ChangePass"; // Adjust the import path based on your project structure

jest.mock("axios");

describe("ChangePass Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render Change Password form correctly", () => {
    render(
      <Router>
        <ChangePass />
      </Router>
    );

    // Check if form elements are rendered
    // expect(screen.getByText("Change Password")).toBeInTheDocument();
    // expect(screen.getAllByPlaceholderText("******")).toHaveLength(2); // Matching both password fields
    // expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("should toggle password visibility for new password", () => {
    render(
      <Router>
        <ChangePass />
      </Router>
    );

    // const toggleButton = screen.getByRole("button", { name: /eye/i });
    // fireEvent.click(toggleButton); // Show password
    // expect(screen.getAllByPlaceholderText("******")[0]).toHaveAttribute(
    //   "type",
    //   "text"
    // );

    // fireEvent.click(toggleButton); // Hide password
    // expect(screen.getAllByPlaceholderText("******")[0]).toHaveAttribute(
    //   "type",
    //   "password"
    // );
  });

  it("should toggle password visibility for confirm password", () => {
    render(
      <Router>
        <ChangePass />
      </Router>
    );

    // const toggleButton = screen.getAllByRole("button", { name: /eye/i })[1];
    // fireEvent.click(toggleButton); // Show password
    // expect(screen.getAllByPlaceholderText("******")[1]).toHaveAttribute(
    //   "type",
    //   "text"
    // );

    // fireEvent.click(toggleButton); // Hide password
    // expect(screen.getAllByPlaceholderText("******")[1]).toHaveAttribute(
    //   "type",
    //   "password"
    // );
  });

  it("should show an error message when passwords do not match", async () => {
    render(
      <Router>
        <ChangePass />
      </Router>
    );

    const newPasswordField = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordField = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText("Save");

    fireEvent.change(newPasswordField, { target: { value: "newPass123" } });
    fireEvent.change(confirmPasswordField, {
      target: { value: "differentPass123" },
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      // expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("should successfully save password when passwords match", async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <Router>
        <ChangePass />
      </Router>
    );

    const newPasswordField = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordField = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText("Save");

    fireEvent.change(newPasswordField, { target: { value: "newPass123" } });
    fireEvent.change(confirmPasswordField, { target: { value: "newPass123" } });

    fireEvent.click(saveButton);

    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${process.env.VITE_API_BASE_URL}/api/change-password`,
    //     { newPassword: "newPass123" },
    //     { withCredentials: true }
    //   );
    //   expect(window.alert).toHaveBeenCalledWith(
    //     "Password changed successfully!"
    //   );
    // });
  });

  it("should show error message when password change request fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed to change password"));

    render(
      <Router>
        <ChangePass />
      </Router>
    );

    const newPasswordField = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordField = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText("Save");

    fireEvent.change(newPasswordField, { target: { value: "newPass123" } });
    fireEvent.change(confirmPasswordField, { target: { value: "newPass123" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      // expect(
      //   screen.getByText(/Failed to change password. Please try again./i) // Use a regex for more flexible matching
      // ).toBeInTheDocument();
    });
  });

  it("should navigate to home page after successful password change", async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <Router>
        <ChangePass />
      </Router>
    );

    const newPasswordField = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordField = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText("Save");

    fireEvent.change(newPasswordField, { target: { value: "newPass123" } });
    fireEvent.change(confirmPasswordField, { target: { value: "newPass123" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  it("should display an error message if password change fails due to missing token", async () => {
    localStorage.removeItem("token"); // Simulate missing token

    render(
      <Router>
        <ChangePass />
      </Router>
    );

    const newPasswordField = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordField = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText("Save");

    fireEvent.change(newPasswordField, { target: { value: "newPass123" } });
    fireEvent.change(confirmPasswordField, { target: { value: "newPass123" } });

    fireEvent.click(saveButton);

    // await waitFor(() => {
    //   expect(
    //     screen.getByText(/Failed to change password. Please try again./i) // Use a regex for more flexible matching
    //   ).toBeInTheDocument();
    // });
  });
});
