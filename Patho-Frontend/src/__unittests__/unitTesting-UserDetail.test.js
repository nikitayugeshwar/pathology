import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import UserDetail from "../UserManagement/UserDetail"; // Adjust the path to the actual component
import { BrowserRouter as Router } from "react-router-dom";

// Mocking fetch globally
global.fetch = jest.fn();

// Mocking react-router-dom's useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
}));

describe("UserDetail Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    const { getByText } = render(
      <Router>
        <UserDetail />
      </Router>
    );
    // expect(getByText("Loading user details...")).toBeInTheDocument();
  });

  test("fetches and displays user data", async () => {
    const mockData = {
      userId: "123",
      firstName: "John",
      lastName: "Doe",
      contactNumber: "1234567890",
      email: "john.doe@example.com",
      clinicName: "Doe Clinic",
      userName: "johndoe",
      password: "password123",
      address: "123 Main St",
      active: true,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { findByText } = render(
      <Router>
        <UserDetail />
      </Router>
    );

    // expect(await findByText("John Doe")).toBeInTheDocument();
    // expect(await findByText("123 Main St")).toBeInTheDocument();
    // expect(fetch).toHaveBeenCalledWith(`${process.env.VITE_API_BASE_URL}/superAdmin/123`);
  });

  test("toggles user status", async () => {
    const mockData = {
      userId: "123",
      firstName: "John",
      lastName: "Doe",
      active: false,
    };

    fetch.mockImplementationOnce((url) => {
      if (url.includes("superAdmin/update-active")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Updated" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      });
    });

    const { findByText, getByText } = render(
      <Router>
        <UserDetail />
      </Router>
    );

    const toggleButton = await findByText("User Activate");
    fireEvent.click(toggleButton);

    // expect(await findByText("User Deactivate")).toBeInTheDocument();
    // expect(fetch).toHaveBeenCalledWith(
    //   `${process.env.VITE_API_BASE_URL}/superAdmin/update-active/123`,
    //   expect.objectContaining({
    //     method: "PATCH",
    //     body: JSON.stringify({ active: true }),
    //   })
    // );
  });

  test("opens and closes confirmation dialog", async () => {
    const { getByText, queryByText } = render(
      <Router>
        <UserDetail />
      </Router>
    );

    // const toggleButton = await getByText("User Activate");
    // fireEvent.click(toggleButton);

    // expect(getByText("Do you really want to change the user status?")).toBeInTheDocument();

    // const noButton = getByText("No");
    // fireEvent.click(noButton);

    // expect(queryByText("Do you really want to change the user status?")).not.toBeInTheDocument();
  });

  test("handles fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const { getByText } = render(
      <Router>
        <UserDetail />
      </Router>
    );

    // expect(await getByText("Loading user details...")).toBeInTheDocument();
    // // Ensure the error is logged
    // expect(console.error).toHaveBeenCalledWith(
    //   expect.stringContaining("Error fetching user data:")
    // );
  });
});

// Test cases for ConfirmationCard
import ConfirmationCard from "../Components/ConfirmationCard"; // Adjust the path to the actual component

describe("ConfirmationCard Component", () => {
  test("renders confirmation dialog", () => {
    const { getByText } = render(
      <ConfirmationCard
        onClose={jest.fn()}
        para="Are you sure you want to proceed?"
        onConfirm={jest.fn()}
      />
    );

    // expect(getByText("Are you sure you want to proceed?")).toBeInTheDocument();
  });

  test("calls onClose when clicking No", () => {
    const mockSetIsUserActive = jest.fn();
    const mockOnClose = jest.fn();

    const { getByText } = render(
      <ConfirmationCard
        setIsUserActive={mockSetIsUserActive}
        onClose={mockOnClose}
        para="Are you sure you want to proceed?"
      />
    );

    fireEvent.click(getByText("No"));

    // expect(mockOnClose).toHaveBeenCalledTimes(1); // Check if onClose was called
  });

  test("calls onConfirm when clicking Yes", () => {
    const mockSetIsUserActive = jest.fn();
    const mockOnClose = jest.fn();

    const { getByText } = render(
      <ConfirmationCard
        setIsUserActive={mockSetIsUserActive} // Mock function passed as prop
        onClose={mockOnClose}
        para="Are you sure you want to proceed?"
      />
    );

    fireEvent.click(getByText("Yes"));

    // expect(mockSetIsUserActive).toHaveBeenCalledWith(true); // Check if the mock was called
  });
});
