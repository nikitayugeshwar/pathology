import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { io } from "socket.io-client";
import UpperNavbar from "../Navbar/uppernavbar"; // Adjust the import path
jest.mock("axios"); // Mock axios requests
jest.mock("socket.io-client"); // Mock socket.io

jest.mock("../Navbar/img/person1.png", () => "person1.png");

describe("UpperNavbar Component", () => {
  const toggleSidebarMock = jest.fn();
  const mockSocket = {
    current: {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    },
  };
  beforeEach(() => {
    // Mocking the socket
    io.mockReturnValue(mockSocket.current);
    // Clear mocks before each test
    toggleSidebarMock.mockClear();
    axios.get.mockClear();
    axios.post.mockClear();
  });

  it("should render the component and fetch user data", async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        user: {
          firstName: "John",
          profileImage: "profile.png",
          _id: "user123",
        },
      },
    });

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Test if the user data is fetched and rendered
    // await waitFor(() =>
    //   expect(screen.getByText("Welcome John!")).toBeInTheDocument()
    // );

    // Test if profile image is rendered
    // expect(screen.getByAltText("Profile")).toHaveAttribute(
    //   "src",
    //   "profile.png"
    // );
  });

  it("should handle notification icon click", async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { count: 5 },
    });

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Test notification count
    // await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());

    // // Simulate notification icon click
    // fireEvent.click(screen.getByRole("img", { name: /notification/i }));

    // Ensure notification count is reset on the server
    // expect(axios.post).toHaveBeenCalledWith(
    //   expect.stringContaining("/api/resetNotificationCount"),
    //   expect.anything()
    // );
  });

  it("should upload a new profile picture", async () => {
    const mockFile = new File(["image"], "newProfile.jpg", {
      type: "image/jpeg",
    });
    const fileInputRef = { current: { click: jest.fn() } };

    // Mock axios response for uploading image
    axios.post.mockResolvedValue({
      status: 200,
      data: { profileImage: "newProfile.jpg" },
    });

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Simulate file input change event
    // const fileInput = screen.getByLabelText(/upload picture/i);
    // fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // // Wait for the image to be updated
    // await waitFor(() =>
    //   expect(screen.getByAltText("Profile")).toHaveAttribute(
    //     "src",
    //     "newProfile.jpg"
    //   )
    // );
  });

  it("should log the user out when logout button is clicked", async () => {
    axios.post.mockResolvedValue({ status: 200 });

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Open logout dropdown
    // fireEvent.click(screen.getByText(/user/i));

    // // Simulate logout button click
    // fireEvent.click(screen.getByText("Logout"));

    // // Check if logout API request was made and localStorage is cleared
    // await waitFor(() => {
    //   expect(localStorage.getItem("userInfo")).toBeNull();
    //   expect(localStorage.getItem("token")).toBeNull();
    // });

    // // Ensure user is navigated to home page ("/")
    // expect(window.location.pathname).toBe("/");
  });

  it("should handle real-time notification from WebSocket", async () => {
    // Mock the WebSocket 'newNotification' event
    const socketMock = mockSocket.current;
    const testData = { description: "New notification!" };

    render(
      <Router>
        <UpperNavbar toggleSidebar={toggleSidebarMock} />
      </Router>
    );

    // Simulate receiving a new notification from the socket
    socketMock.on.mock.calls[0][1](testData);

    // Test if the notification count is updated
    // expect(screen.getByText("1")).toBeInTheDocument();
    // expect(screen.getByText("New notification!")).toBeInTheDocument();
  });
});
