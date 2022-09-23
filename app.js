import * as api from "./api/api.js";

const apiUrl = "https://gorest.co.in/public/v2/users";
let users = null;
let currentIndex = null;
let isEdit = false;
let isVisible = false;
let row = document.createElement("tr");
let tableContainer = document.getElementById("tableContainer");
const token =
  "9e90ab20d7b55f74ff5b4a4d5d574db2511adc7953b78c7eeb392bbac91aa785";
const showColumns = ["ID", "NAME", "EMAIL", "AÇÕES"];
let user = {
  id: "",
  name: "",
  email: "",
  gender: "",
  status: "",
};

const inName = document.getElementById("inName");
const inEmail = document.getElementById("inEmail");
const seGender = document.getElementById("seGender");
const seStatus = document.getElementById("seStatus");

async function getUsers() {
  try {
    const response = await api.$get(apiUrl, token);
    return response;
  } catch (error) {
    alert(error);
  }
}

async function manageUser() {
  try {
    user.name = inName.value;
    user.email = inEmail.value;
    user.gender = seGender.value;
    user.status = seStatus.value;
    let response = null;
    if (!isEdit) {
      response = await api.$post(apiUrl, token, user).then((response) => {
        users.push(response);
      });
    } else {
      response = await api.$put(apiUrl, token, user, user.id).then((resp) => {
        isEdit = false;
        users[currentIndex].id = resp.id;
        users[currentIndex].name = resp.name;
        users[currentIndex].email = resp.email;
        users[currentIndex].gender = resp.gender;
        users[currentIndex].status = resp.status;
      });
    }
    clearTable();
    createTable();
    clearForm();
    return response;
  } catch (error) {
    alert(error);
  }
}

async function deleteUser(id, index) {
  console.log(users[index]);
  await api
    .$delete(apiUrl, token, id)
    .then(() => {
      users.splice(index, 1);
      clearTable();
      createTable();
    })
    .catch((error) => alert(error));
}

function clearForm() {
  inName.value = "";
  inEmail.value = "";
  seGender.value = "";
  seStatus.value = "";
}

function createRow(user, index) {
  let tr = document.createElement("tr");
  Object.entries(user).forEach(([key, value]) => {
    if (showColumns.find((coluna) => coluna === key.toUpperCase())) {
      let td = document.createElement("td");
      td.innerHTML = value;
      tr.appendChild(td);
    }
  });

  let tdActions = document.createElement("td");
  let btnEdit = document.createElement("button");
  let btnDelete = document.createElement("button");

  // BTN EDIT
  btnEdit.innerHTML = "Editar";
  btnEdit.value = index;
  btnEdit.addEventListener("click", () => {
    editUser(index);
  });

  // BTN DELETE
  btnDelete.value = user.id;
  btnDelete.innerHTML = "Excluir";
  btnDelete.addEventListener("click", () => {
    deleteUser(user.id, index);
  });

  tdActions.appendChild(btnEdit);
  tdActions.appendChild(btnDelete);
  tr.appendChild(tdActions);

  return tr;
}

// CREATE
function createTable() {
  let usersTable = document.createElement("table");

  usersTable.id = "usersTable";
  usersTable.name = "usersTable";

  Object.keys(users[0])
    .concat("AÇÕES")
    .forEach((key) => {
      if (showColumns.find((coluna) => coluna === key.toUpperCase())) {
        let th = document.createElement("th");
        th.innerHTML = key.toUpperCase();
        row.appendChild(th);
      }
    });

  usersTable.appendChild(row);
  users.forEach((element, index) => {
    usersTable.appendChild(createRow(element, index));
  });
  tableContainer.appendChild(usersTable);
}

// EDIT
function editUser(index) {
  currentIndex = index;
  isEdit = true;
  user.id = users[index].id;
  inName.value = users[index].name;
  inEmail.value = users[index].email;
  seGender.value = users[index].gender;
  seStatus.value = users[index].status;
}

function clearTable() {
  currentIndex = null;
  user.id = "";
  tableContainer.innerHTML = "";
  row.innerHTML = "";
}

async function main() {
  const btnSubmit = document.getElementById("btnSubmit");
  const formUser = document.getElementById("formUser");
  const btnAddUser = document.getElementById("btnAddUser");
  
  users = await getUsers();
  
  createTable();

  btnSubmit.addEventListener("click", manageUser, false);
  btnAddUser.addEventListener(
    "click",
    () => {
      isVisible = !isVisible;
      if (isVisible) formUser.classList.add("show");
      else formUser.classList.remove("show");
    },
    false
  );
}
main();