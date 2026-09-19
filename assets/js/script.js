import { StudentList } from "./data.js";

let students = [...StudentList];
let formMode = "";
let selectedStudentId = -1;

const tbody = document.getElementById("student-data");

const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

const fields = {
  lastName: document.getElementById("txt-lastName"),
  firstName: document.getElementById("txt-firstName"),
  middleName: document.getElementById("txt-middleName"),
  gender: document.getElementById("txt-gender"),
  yearLevel: document.getElementById("txt-year-level"),
  section: document.getElementById("txt-section"),
  email: document.getElementById("txt-email")
};

document.addEventListener("DOMContentLoaded", () => {
  resetForm();
  fetchStudentData();
});

addBtn.addEventListener("click", () => {
  formMode = "Add";
  selectedStudentId = -1;
  clearInputFields();
  enableFormFields(true);
  toggleButtons(true, false);
});

editBtn.addEventListener("click", () => {
  if (selectedStudentId === -1) return;

  const student = getStudentById(selectedStudentId);
  if (!student) return;

  formMode = "Edit";
  populateFormFields(student);
  enableFormFields(true);
  toggleButtons(true, false);
});

deleteBtn.addEventListener("click", () => {
  if (selectedStudentId === -1) return;

  if (!confirm("Are you sure you want to delete this student?")) return;

  deleteStudent();
  resetForm();
  fetchStudentData();
});

saveBtn.addEventListener("click", () => {
  if (validateForm().length > 0) return;

  if (formMode === "Add") {
    addStudent();
  } else if (formMode === "Edit") {
    updateStudent();
  }

  resetForm();
  fetchStudentData();
});

cancelBtn.addEventListener("click", () => {
  resetForm();
  if (selectedStudentId !== -1) {
    const student = getStudentById(selectedStudentId);
    if (student) {
      populateFormFields(student);
    }
  }
});

function fetchStudentData() {
  tbody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.lastname}</td>
      <td>${student.firstname}</td>
      <td>${student.middlename}</td>
      <td>${student.gender}</td>
      <td>${student.year_level}</td>
      <td>${student.section}</td>
      <td>${student.email}</td>
    `;

    row.addEventListener("click", () => {
      selectedStudentId = student.id;
      populateFormFields(student);
      enableFormFields(false);
      toggleButtons(false, true);
    });

    tbody.appendChild(row);
  });
}

function addStudent() {
  const nextId = students.length
    ? Math.max(...students.map((s) => Number(s.id))) + 1
    : 1;

  students.push({
    id: String(nextId),
    lastname: fields.lastName.value.trim(),
    firstname: fields.firstName.value.trim(),
    middlename: fields.middleName.value.trim(),
    gender: fields.gender.value.trim(),
    year_level: fields.yearLevel.value.trim(),
    section: fields.section.value.trim(),
    email: fields.email.value.trim()
  });

  selectedStudentId = String(nextId);
  formMode = "";
}

function updateStudent() {
  const student = getStudentById(selectedStudentId);
  if (!student) return;

  student.lastname = fields.lastName.value.trim();
  student.firstname = fields.firstName.value.trim();
  student.middlename = fields.middleName.value.trim();
  student.gender = fields.gender.value.trim();
  student.year_level = fields.yearLevel.value.trim();
  student.section = fields.section.value.trim();
  student.email = fields.email.value.trim();

  formMode = "";
}

function deleteStudent() {
  const index = students.findIndex((s) => String(s.id) === String(selectedStudentId));
  if (index >= 0) {
    students.splice(index, 1);
  }

  selectedStudentId = -1;
  formMode = "";
}

function populateFormFields(student) {
  fields.lastName.value = student.lastname || "";
  fields.firstName.value = student.firstname || "";
  fields.middleName.value = student.middlename || "";
  fields.gender.value = student.gender || "";
  fields.yearLevel.value = student.year_level || "";
  fields.section.value = student.section || "";
  fields.email.value = student.email || "";
}

function clearInputFields() {
  Object.values(fields).forEach((input) => {
    input.value = "";
  });
}

function resetForm() {
  formMode = "";
  selectedStudentId = -1;
  clearInputFields();
  enableFormFields(false);
  toggleButtons(false, false);
}

function toggleButtons(showSaveCancel = false, showEditDelete = false) {
  saveBtn.classList.toggle("display-none", !showSaveCancel);
  cancelBtn.classList.toggle("display-none", !showSaveCancel);
  editBtn.classList.toggle("display-none", !showEditDelete);
  deleteBtn.classList.toggle("display-none", !showEditDelete);
}

function enableFormFields(enable = false) {
  Object.values(fields).forEach((input) => {
    input.disabled = !enable;
  });
}

function validateForm() {
  const errors = [];

  if (!fields.lastName.value.trim()) errors.push("Last Name is required.");
  if (!fields.firstName.value.trim()) errors.push("First Name is required.");
  if (!fields.middleName.value.trim()) errors.push("Middle Name is required.");
  if (!fields.gender.value.trim()) errors.push("Gender is required.");
  if (!fields.yearLevel.value.trim()) errors.push("Year Level is required.");
  if (!fields.section.value.trim()) errors.push("Section is required.");
  if (!fields.email.value.trim()) errors.push("Email is required.");

  if (errors.length > 0) {
    alert(errors.join("\n"));
  }

  return errors;
}

function getStudentById(studentId) {
  return students.find((student) => String(student.id) === String(studentId));
}