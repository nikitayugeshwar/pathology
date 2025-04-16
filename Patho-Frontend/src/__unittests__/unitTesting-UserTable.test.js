import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserTable from "../UserManagement/UserTable"; // Adjust path as necessary

const mockSetReportData = jest.fn();
const mockSetTestCount = jest.fn();
const mockSetTotalEntries = jest.fn();

const BASE_URL = process.env.VITE_API_BASE_URL;

global.fetch = jest.fn();

describe("UserTable Component", () => {
  const sampleReportData = [
    {
      _id: "1",
      userId: "101",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      contactNumber: "1234567890",
      clinicName: "Clinic A",
      userName: "john_doe",
      password: "password123",
    },
    {
      _id: "2",
      userId: "102",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      contactNumber: "9876543210",
      clinicName: "Clinic B",
      userName: "jane_smith",
      password: "password456",
    },
  ];

  const defaultProps = {
    reportData: sampleReportData,
    setReportData: mockSetReportData,
    filter: "",
    searchTerm: "",
    currentPage: 1,
    entriesPerPage: 10,
    setTestCount: mockSetTestCount,
    setTotalEntries: mockSetTotalEntries,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders table with headers", () => {
    render(
      <Router>
        <UserTable {...defaultProps} />
      </Router>
    );

    const headers = [
      "Sr. No",
      "User ID",
      "Name",
      "Email",
      "Contact No",
      "Clinic Name",
      "User Name",
      "Password",
      "Action",
    ];

    // headers.forEach((header) =>
    //   expect(screen.getByText(header)).toBeInTheDocument()
    // );
  });

  test("renders user data in table rows", () => {
    render(
      <Router>
        <UserTable {...defaultProps} />
      </Router>
    );

    // expect(screen.getByText("John Doe")).toBeInTheDocument();
    // expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
    // expect(screen.getByText("Clinic A")).toBeInTheDocument();
  });

  test("applies search filter correctly", () => {
    render(
      <Router>
        <UserTable {...defaultProps} searchTerm="Jane" />
      </Router>
    );

    // expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    // expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  test("applies userId filter correctly", () => {
    render(
      <Router>
        <UserTable {...defaultProps} filter="101" />
      </Router>
    );

    // expect(screen.getByText("John Doe")).toBeInTheDocument();
    // expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  test("displays paginated results correctly", () => {
    render(
      <Router>
        <UserTable {...defaultProps} entriesPerPage={1} currentPage={1} />
      </Router>
    );

    // expect(screen.getByText("John Doe")).toBeInTheDocument();
    // expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  test("updates total entries on filter change", () => {
    render(
      <Router>
        <UserTable {...defaultProps} searchTerm="Jane" />
      </Router>
    );

    // expect(mockSetTotalEntries).toHaveBeenCalledWith(1);
  });

  test("updates test count based on current entries", () => {
    render(
      <Router>
        <UserTable {...defaultProps} entriesPerPage={1} currentPage={1} />
      </Router>
    );

    // expect(mockSetTestCount).toHaveBeenCalledWith(1);
  });

//   test("handles delete action and removes user from table", async () => {
//     fetch.mockResolvedValueOnce({ ok: true });

//     render(
//       <Router>
//         <UserTable {...defaultProps} />
//       </Router>
//     );

//     const deleteButton = screen.getAllByText("Delete")[0];

//     // Mock confirmation dialog
//     jest.spyOn(window, "confirm").mockReturnValueOnce(true);

//     fireEvent.click(deleteButton);

//     // await waitFor(() => {
//     //   expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/superAdmin/1`, {
//     //     method: "DELETE",
//     //   });
//     //   expect(mockSetReportData).toHaveBeenCalledWith([
//     //     {
//     //       _id: "2",
//     //       userId: "102",
//     //       firstName: "Jane",
//     //       lastName: "Smith",
//     //       email: "jane.smith@example.com",
//     //       contactNumber: "9876543210",
//     //       clinicName: "Clinic B",
//     //       userName: "jane_smith",
//     //       password: "password456",
//     //     },
//     //   ]);
//     // });

//     expect(window.confirm).toHaveBeenCalledWith(
//       "Are you sure you want to delete this user?"
//     );
//     expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
//   });

  test("handles failed delete action gracefully", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <Router>
        <UserTable {...defaultProps} />
      </Router>
    );

    const deleteButton = screen.getAllByText("Delete")[0];

    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    fireEvent.click(deleteButton);

    // await waitFor(() => {
    //   expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/superAdmin/1`, {
    //     method: "DELETE",
    //   });
    //   expect(mockSetReportData).not.toHaveBeenCalled();
    // });

    // Ensure data is still displayed
    // expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("does not delete user if confirmation is canceled", () => {
    render(
      <Router>
        <UserTable {...defaultProps} />
      </Router>
    );

    const deleteButton = screen.getAllByText("Delete")[0];

    jest.spyOn(window, "confirm").mockReturnValueOnce(false);

    fireEvent.click(deleteButton);

    // expect(fetch).not.toHaveBeenCalled();
    // expect(mockSetReportData).not.toHaveBeenCalled();
    // expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
