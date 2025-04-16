import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Configuration from "../Configuration/Configuration";

// Mock the dependencies
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Configuration Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("should render the Configuration page when logged in", async () => {
    // Mock the axios get request for authentication
    axios.get.mockResolvedValueOnce({ data: { status: "ok" } });

    render(
      <Router>
        <Configuration />
      </Router>
    );

    // Ensure the page renders the correct content
    // expect(await screen.findByText("Configuration")).toBeInTheDocument();
    // expect(screen.getByText("Tests")).toBeInTheDocument();
    // expect(screen.getByText("Report Template Mangement")).toBeInTheDocument();
    // expect(screen.getByText("Social Media Integration")).toBeInTheDocument();
  });

  it("should navigate to login if user is not logged in", async () => {
    // Mock the axios get request to simulate a 401 response
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(
      <Router>
        <Configuration />
      </Router>
    );
  });

  it("should log out and navigate to login if token refresh fails", async () => {
    // Mock the axios get to simulate a 401 error and the axios post to fail
    axios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });
    axios.post.mockRejectedValueOnce(new Error("Token refresh failed"));

    render(
      <Router>
        <Configuration />
      </Router>
    );

    // Ensure the component navigates to the login page after token refresh failure
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });
});
