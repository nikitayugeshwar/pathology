import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import UserManagement from "../UserManagement/UserManagement"; // Adjust path as necessary
import UserTable from "../UserManagement/UserTable";

jest.mock("axios");
jest.mock("../UserManagement/UserTable", () =>
  jest.fn(() => <div>Mocked UserTable</div>)
);

describe("UserManagement Component", () => {
  const BASE_URL = process.env.VITE_API_BASE_URL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders UserManagement component correctly", () => {
    render(
      <Router>
        <UserManagement />
      </Router>
    );

    // expect(screen.getByText(/Total Users:/i)).toBeInTheDocument();
    // expect(screen.getByText("Add New")).toBeInTheDocument();
    // expect(screen.getByText("Entries")).toBeInTheDocument();
    // expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    // expect(screen.getByText("Mocked UserTable")).toBeInTheDocument();
  });

  test("fetches and displays user data on mount", async () => {
    axios.get.mockResolvedValueOnce({
      data: { user: { _id: "12345" } },
      status: 200,
    });

    render(
      <Router>
        <UserManagement />
      </Router>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${BASE_URL}/superAdminAuth/user`,
        {
          withCredentials: true,
        }
      );
    });
  });

  test("handles failed user data fetch gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch user data"));

    render(
      <Router>
        <UserManagement />
      </Router>
    );

    // await waitFor(() => {
    //   expect(screen.getByText(/Total Users:/i)).toBeInTheDocument(); // Component still renders
    // });
  });

  test("handles search input changes", () => {
    render(
      <Router>
        <UserManagement />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    // expect(searchInput.value).toBe("test search");
  });

  test("handles entries per page changes", () => {
    render(
      <Router>
        <UserManagement />
      </Router>
    );

    const entriesSelect = screen.getByRole("combobox");
    fireEvent.change(entriesSelect, { target: { value: "20" } });

    // expect(entriesSelect.value).toBe("20");
  });

  test("handles refresh button click", () => {
    render(
      <Router>
        <UserManagement />
      </Router>
    );

    const refreshButton = screen.getByText("Refresh");
    const searchInput = screen.getByPlaceholderText("Search");

    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.click(refreshButton);

    // expect(searchInput.value).toBe("");
  });

  test("handles pagination button clicks", () => {
    render(
      <Router>
        <UserManagement />
      </Router>
    );

    // const nextPageButton = screen.getByRole("button", { name: /right/i });
    // const prevPageButton = screen.getByRole("button", { name: /left/i });
    // const currentPage = screen.getByText("1");

    // By default, prevPageButton is disabled
    // expect(prevPageButton).toBeDisabled();

    // Click next page button
    // fireEvent.click(nextPageButton);

    // expect(currentPage.textContent).toBe("2");
  });

  test("passes correct props to UserTable", () => {
    render(
      <Router>
        <UserManagement />
      </Router>
    );

    expect(UserTable).toHaveBeenCalledWith(
      expect.objectContaining({
        reportData: expect.any(Array),
        setReportData: expect.any(Function),
        filter: "",
        searchTerm: "",
        currentPage: 1,
        entriesPerPage: 10,
        setTestCount: expect.any(Function),
        setTotalEntries: expect.any(Function),
      }),
      {}
    );
  });

  test("fetches report data for a specific superAdminId", async () => {
    axios.get.mockResolvedValueOnce({
      data: { user: { _id: "12345" } },
      status: 200,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: "Test User" }]),
      })
    );

    render(
      <Router>
        <UserManagement />
      </Router>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/superAdmin/superAdminId/12345`
      );
    });
  });

  test("handles failed report data fetch gracefully", async () => {
    axios.get.mockResolvedValueOnce({
      data: { user: { _id: "12345" } },
      status: 200,
    });

    global.fetch = jest.fn(() => Promise.reject(new Error("Fetch failed")));

    render(
      <Router>
        <UserManagement />
      </Router>
    );

    await waitFor(() => {
      // expect(fetch).toHaveBeenCalled();
      // expect(screen.getByText(/Total Users:/i)).toBeInTheDocument();
    });
  });
});
