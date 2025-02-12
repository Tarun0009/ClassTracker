// src/StudentList.js
import React from "react";

const StudentList = ({ students, markAttendence, deleteStudent, customTheme }) => {
  // Mapping for list-group item border based on theme
  const listGroupBorderMapping = {
    default: "",
    green: "border-success",
    red: "border-danger",
    blue: "border-primary",
  };

  // Mapping for header text color in StudentList
  const headerThemeMapping = {
    default: "text-secondary",
    green: "text-success",
    red: "text-danger",
    blue: "text-primary",
  };

  return (
    <div className="mt-4">
      <h3 className={headerThemeMapping[customTheme]}>Attendence List</h3>
      {students.length === 0 ? (
        <p className="text-muted">No students added.</p>
      ) : (
        <ul className="list-group">
          {students.map((student, index) => (
            <li
              key={index}
              className={`list-group-item d-flex justify-content-between align-items-center ${listGroupBorderMapping[customTheme]}`}
            >
              <div>
                <span className="fw-bold">{student.name}</span>
                <br />
                <small className="text-muted">Date: {student.date}</small>
              </div>
              <div>
                <button
                  className={`btn btn-sm mx-1 ${
                    student.status === "Present"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => markAttendence(index, "Present")}
                >
                  Present
                </button>
                <button
                  className={`btn btn-sm mx-1 ${
                    student.status === "Absent"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => markAttendence(index, "Absent")}
                >
                  Absent
                </button>
                <button
                  className="btn btn-sm btn-dark ms-2"
                  onClick={() => deleteStudent(index)}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentList;
