let editIndex = null;

/* ========= AUTH ========= */
function login() {
    if (
        adminId.value === "Yoges27293kl" &&
        adminPass.value === "098098yyy@$YY"
    ) {
        loginBox.style.display = "none";
        mainSite.style.display = "block";
        renderTables();
        showBranch("cse");
    } else {
        errorMsg.innerText = "Invalid Login";
    }
}

/* ========= STORAGE ========= */
function getStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(data) {
    localStorage.setItem("students", JSON.stringify(data));
}

/* ========= ADD / UPDATE ========= */
function addStudent() {
    const roll = document.getElementById("roll").value.trim();
    const name = document.getElementById("name").value.trim();
    const attendance = parseInt(document.getElementById("attendance").value);
    const branch = document.getElementById("branch").value;

    if (!roll || !name || isNaN(attendance)) {
        alert("Fill all fields");
        return;
    }

    let students = getStudents();

    if (editIndex === null) {
        if (students.some(s => s.roll === roll && s.branch === branch)) {
            alert("Student already exists");
            return;
        }
        students.push({ roll, name, attendance, branch });
    } else {
        students[editIndex] = { roll, name, attendance, branch };
        editIndex = null;
        submitBtn.innerText = "Add Student";
    }

    saveStudents(students);
    clearForm();
    renderTables();
}

/* ========= RENDER ========= */
function renderTables() {
    document.querySelectorAll("tbody").forEach(t => t.innerHTML = "");
    getStudents().forEach((s, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>${s.attendance}</td>
            <td>
                <button onclick="editStudent(${i})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${i})">Delete</button>
            </td>`;
        document.getElementById(s.branch + "Table").appendChild(tr);
    });
}

/* ========= EDIT / DELETE ========= */
function editStudent(i) {
    const s = getStudents()[i];
    roll.value = s.roll;
    name.value = s.name;
    attendance.value = s.attendance;
    branch.value = s.branch;
    editIndex = i;
    submitBtn.innerText = "Update Student";
}

function deleteStudent(i) {
    if (confirm("Delete?")) {
        let s = getStudents();
        s.splice(i, 1);
        saveStudents(s);
        renderTables();
    }
}

/* ========= LIVE ATTENDANCE ========= */
function loadLiveAttendance() {
    const tbody = document.getElementById("liveAttendanceBody");
    const stats = document.getElementById("stats");
    if (!tbody) return;

    tbody.innerHTML = "";
    const students = getStudents();

    let present = 0;
    students.forEach(s => {
        const status = s.attendance >= 75 ? "Present" : "Absent";
        if (status === "Present") present++;

        tbody.innerHTML += `
            <tr>
                <td>${s.branch.toUpperCase()}</td>
                <td>${s.roll}</td>
                <td>${s.name}</td>
                <td>${s.attendance}%</td>
                <td style="color:${status==="Present"?"green":"red"}">${status}</td>
            </tr>`;
    });

    stats.innerHTML = `
        Total: ${students.length} |
        Present: ${present} |
        Absent: ${students.length - present} |
        Attendance: ${students.length ? Math.round(present/students.length*100) : 0}%
    `;
}

/* ========= UTIL ========= */
function showBranch(id) {
    document.querySelectorAll(".branch").forEach(b => b.style.display = "none");
    document.getElementById(id).style.display = "block";
}

function clearForm() {
    roll.value = name.value = attendance.value = "";
}
