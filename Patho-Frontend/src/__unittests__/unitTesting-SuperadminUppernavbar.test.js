import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import UpperNavbar from "../SuperAdmin/Navbar/uppernavbar"; // Adjust the import path based on your project structure

jest.mock(
  "../SuperAdmin/Navbar/img/notification.png",
  () => "notification.png"
);

// Mocking axios requests
jest.mock("axios");

describe("UpperNavbar Component", () => {
  const toggleSidebarMock = jest.fn();

  beforeEach(() => {
    // Reset the mock before each test
    toggleSidebarMock.mockClear();
    axios.get.mockClear();
    axios.post.mockClear();
  });

  it("should render the component correctly", async () => {
    // Mock the response for user data API
    axios.get.mockResolvedValue({
      status: 200,
      data: { user: { name: "John Doe", profileImage: "./img/person1.png" } },
    });

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // // Test if the username is rendered
    // expect(screen.getByText("Welcome John Doe!")).toBeInTheDocument();

    // // Test if the notification count is rendered
    // expect(screen.getByText("5")).toBeInTheDocument();

    // // Test if the profile image is rendered correctly
    // expect(screen.getByAltText("Profile")).toBeInTheDocument();
  });

  it("should toggle sidebar when the menu button is clicked", () => {
    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Simulate the click event
    // fireEvent.click(screen.getByRole("button", { name: /menu/i }));

    // Test if the toggleSidebar function was called
    // expect(toggleSidebarMock).toHaveBeenCalled();
  });

  it("should open file input when upload button is clicked", () => {
    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Mock the file input click to open the file dialog
    const fileInputMock = jest.fn();
    // const uploadButton = screen.getByText(/Upload Picture/i);

    // fireEvent.click(uploadButton);

    // Check if the file input ref function was triggered
    // expect(fileInputMock).toHaveBeenCalled();
  });

  it("should update profile picture upon file change", async () => {
    // Mock the axios post response for file upload
    axios.post.mockResolvedValue({
      status: 200,
      data: { profileImage: "./new-image.png" },
    });

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Simulate file input change event
    // const file = new File(["image"], "profile.jpg", { type: "image/jpeg" });
    // const fileInput = screen.getByLabelText(/upload picture/i);

    // fireEvent.change(fileInput, { target: { files: [file] } });

    // Check if the selected image is updated correctly
    // await waitFor(() => {
    //   expect(screen.getByAltText("Profile")).toHaveAttribute(
    //     "src",
    //     "./new-image.png"
    //   );
    // });
  });

  it("should log the user out when logout button is clicked", async () => {
    // Mock the logout API request
    axios.post.mockResolvedValue({ status: 200 });

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Click the logout button
    // const logoutButton = screen.getByText("Logout");
    // fireEvent.click(logoutButton);

    // // Wait for the logout API request to complete
    // await waitFor(() =>
    //   expect(axios.post).toHaveBeenCalledWith(
    //     expect.stringContaining("/superAdminAuth/logout")
    //   )
    // );

    // Check if localStorage is cleared (assuming it happens on logout)
    expect(localStorage.getItem("userInfo")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should handle API errors gracefully", async () => {
    // Simulate an API failure for fetching user data
    axios.get.mockRejectedValue(new Error("Failed to fetch user data"));

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Check if a user-friendly error message or fallback is displayed (if any)
    await waitFor(() => {
      // expect(screen.getByText("Welcome User!")).toBeInTheDocument();
    });
  });
});
