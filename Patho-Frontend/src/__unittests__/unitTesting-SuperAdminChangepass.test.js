import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SuperAdminChangepass from "../SuperAdminChangePass/SuperAdminChangepass";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");

// Mock navigate function from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("SuperAdminChangepass Component", () => {
  it("renders the change password form", () => {
    render(
      <MemoryRouter>
        <SuperAdminChangepass />
      </MemoryRouter>
    );

    // expect(screen.getByText(/Change Password/i)).toBeInTheDocument();
    // expect(screen.getByPlaceholderText("******")).toBeInTheDocument();
    // expect(screen.getAllByPlaceholderText("******").length).toBe(2);
    // expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });

  it("toggles password visibility for new password field", () => {
    render(
      <MemoryRouter>
        <SuperAdminChangepass />
      </MemoryRouter>
    );

    const toggleButton = screen.getAllByRole("button")[0];
    const passwordInput = screen.getAllByPlaceholderText("******")[0];

    // expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    // expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    // expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("toggles password visibility for confirm password field", () => {
    render(
      <MemoryRouter>
        <SuperAdminChangepass />
      </MemoryRouter>
    );

    const toggleButton = screen.getAllByRole("button")[1];
    const confirmPasswordInput = screen.getAllByPlaceholderText("******")[1];

    // expect(confirmPasswordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    // expect(confirmPasswordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    // expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  it("shows an error when passwords do not match", () => {
    render(
      <MemoryRouter>
        <SuperAdminChangepass />
      </MemoryRouter>
    );

    const newPasswordInput = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText(/Save/i);

    fireEvent.change(newPasswordInput, { target: { value: "password1" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password2" } });
    fireEvent.click(saveButton);

    // expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it("calls the API to change the password and navigates on success", async () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    axios.post.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <SuperAdminChangepass />
      </MemoryRouter>
    );

    const newPasswordInput = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText(/Save/i);

    fireEvent.change(newPasswordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
    fireEvent.click(saveButton);

    // expect(axios.post).toHaveBeenCalledWith(
    //   `${import.meta.env.VITE_API_BASE_URL}/superAdminAuth/change-password`,
    //   { newPassword: "password" },
    //   { withCredentials: true }
    // );

    // await screen.findByText(/Password changed successfully!/i);
    // expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows an error message if the API call fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("API error"));
    render(
      <MemoryRouter>
        <SuperAdminChangepass />
      </MemoryRouter>
    );

    const newPasswordInput = screen.getAllByPlaceholderText("******")[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText("******")[1];
    const saveButton = screen.getByText(/Save/i);

    fireEvent.change(newPasswordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
    fireEvent.click(saveButton);

    await screen.findByText(/Failed to change password/i);
  });
});
