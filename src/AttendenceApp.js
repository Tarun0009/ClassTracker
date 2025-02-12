// src/AttendenceApp.js
import React, { useState, useEffect } from "react";
import StudentList from "./StudentList";

const AttendenceApp = () => {
  // Retrieve saved students from LocalStorage
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [name, setName] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // States for dark mode, custom theme, search, and pagination
  const [darkMode, setDarkMode] = useState(false);
  const [customTheme, setCustomTheme] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // number of students per page

  // Save students to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Add a new student with today's date
  const addStudent = () => {
    if (name.trim() !== "") {
      const newStudent = {
        name,
        status: "Absent",
        date: new Date().toLocaleDateString(),
      };
      setStudents([...students, newStudent]);
      setName("");
    }
  };

  // Update the attendence status and record the date
  const markAttendence = (index, status) => {
    const updatedStudents = [...students];
    updatedStudents[index].status = status;
    updatedStudents[index].date = new Date().toLocaleDateString();
    setStudents(updatedStudents);
  };

  // Delete a student from the list
  const deleteStudent = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  // Calculate the attendence percentage
  const presentCount = students.filter((s) => s.status === "Present").length;
  const attendencePercentage =
    students.length > 0 ? ((presentCount / students.length) * 100).toFixed(2) : 0;

  // Filter by status
  let filteredStudents = students;
  if (filterStatus !== "All") {
    filteredStudents = filteredStudents.filter(
      (student) => student.status === filterStatus
    );
  }

  // Apply real-time search filter (by student name)
  if (searchQuery.trim() !== "") {
    filteredStudents = filteredStudents.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort students alphabetically by name
  let sortedStudents = [...filteredStudents].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  if (sortOrder === "desc") sortedStudents.reverse();

  // Pagination: Calculate total pages and slice the sorted list
  const totalPages = Math.ceil(sortedStudents.length / pageSize);
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Toggle sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Export the student data as CSV
  const exportCSV = () => {
    const headers = ["Name", "Status", "Date"];
    const rows = students.map((student) => [
      student.name,
      student.status,
      student.date,
    ]);
    const csvContent = [headers, ...rows]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "attendence.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mapping for header text color based on theme (using Bootstrap text color classes)
  const headerThemeMapping = {
    default: "text-primary",
    green: "text-success",
    red: "text-danger",
    blue: "text-info",
  };

  // Mapping for card border based on theme
  const cardBorderMapping = {
    default: "",
    green: "border-success",
    red: "border-danger",
    blue: "border-primary",
  };

  return (
    <div className={`${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      {/* Sticky Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <a className={`navbar-brand ${headerThemeMapping[customTheme]}`} href="https://www.example.com">
            ClassTracker
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Real-Time Search */}
            <form className="d-flex ms-auto">
              <input
                type="search"
                className="form-control me-2"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </form>
            <div className="d-flex align-items-center">
              <div className="form-check form-switch me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkModeToggle"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <label className="form-check-label" htmlFor="darkModeToggle">
                  Dark Mode
                </label>
              </div>
              <div>
                <select
                  className="form-select"
                  style={{ width: "150px" }}
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container (with top padding to account for fixed header) */}
      <div className="mt-5 pt-5">
        <div className="container">
          <div className={`card p-3 shadow-sm ${cardBorderMapping[customTheme]}`}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={addStudent}>
              Add Student
            </button>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              <label htmlFor="filter" className="form-label me-2">
                Filter:
              </label>
              <select
                id="filter"
                className="form-select d-inline-block w-auto"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div>
              <button className="btn btn-secondary me-2" onClick={toggleSortOrder}>
                Sort by Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
              </button>
              <button className="btn btn-outline-success" onClick={exportCSV}>
                Download Attendence
              </button>
            </div>
          </div>

          {/* Student List */}
          <StudentList
            students={paginatedStudents}
            markAttendence={markAttendence}
            deleteStudent={deleteStudent}
            customTheme={customTheme}
          />

          {/* Pagination */}
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages || totalPages === 0 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>

          <div className="mt-4 text-center">
            <h4 className="text-info">
              Attendence Percentage: {attendencePercentage}%
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendenceApp;
