// --------- Init Storage (first run) ----------
(function init() {
    if (!localStorage.getItem("users")) {
        const users = [
            { id: 1, name: "Ravi", email: "emp@test.com", password: "1234", role: "employee" },
            { id: 2, name: "Manager", email: "manager@test.com", password: "1234", role: "manager" }
        ];
        const balances = {
            1: { vacation: 10, sick: 5, emergency: 5 }
        };
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("balances", JSON.stringify(balances));
        localStorage.setItem("leaves", JSON.stringify([]));
    }
})();

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}
function getBalances() {
    return JSON.parse(localStorage.getItem("balances")) || {};
}
function getLeaves() {
    return JSON.parse(localStorage.getItem("leaves")) || [];
}
function saveBalances(b) {
    localStorage.setItem("balances", JSON.stringify(b));
}
function saveLeaves(l) {
    localStorage.setItem("leaves", JSON.stringify(l));
}

// --------- Auth ----------
function login() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let user = getUsers().find(u => u.email === email && u.password === pass);
    if (!user) {
        document.getElementById("msg").innerText = "Invalid credentials";
        return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = user.role === "employee" ? "employee.html" : "manager.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// --------- Employee ----------
function loadEmployee() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "employee") {
        window.location.href = "login.html";
        return;
    }

    let balances = getBalances();
    document.getElementById("empName").innerText = user.name;
    document.getElementById("vacation").innerText = balances[user.id].vacation;
    document.getElementById("sick").innerText = balances[user.id].sick;
    document.getElementById("emergency").innerText = balances[user.id].emergency;

    showMyLeaves(user.id);
}

function goApply() {
    window.location.href = "apply-leave.html";
}

function showMyLeaves(uid) {
    let leaves = getLeaves();
    let div = document.getElementById("myLeaves");
    let html = "";

    leaves.filter(l => l.userId === uid).forEach(l => {
        html += `<div class="card">${l.type} (${l.start} → ${l.end}) - <b>${l.status}</b></div>`;
    });

    div.innerHTML = html || "No leave requests";
}

function submitLeave() {
    let user = JSON.parse(localStorage.getItem("user"));
    let leaves = getLeaves();

    let leave = {
        userId: user.id,
        type: document.getElementById("type").value,
        start: document.getElementById("start").value,
        end: document.getElementById("end").value,
        reason: document.getElementById("reason").value,
        status: "pending"
    };

    leaves.push(leave);
    saveLeaves(leaves);

    alert("Leave submitted!");
    window.location.href = "employee.html";
}

function backEmp() {
    window.location.href = "employee.html";
}

// --------- Manager ----------
function loadManager() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "manager") {
        window.location.href = "login.html";
        return;
    }
    showAllLeaves();
}

function showAllLeaves() {
    let leaves = getLeaves();
    let div = document.getElementById("allLeaves");
    let html = "";

    leaves.forEach((l, i) => {
        html += `
        <div class="card">
            <p>User: ${l.userId}</p>
            <p>${l.type} (${l.start} → ${l.end})</p>
            <p>Status: <b>${l.status}</b></p>
            <button onclick="approve(${i})">Approve</button>
            <button onclick="reject(${i})">Reject</button>
        </div>`;
    });

    div.innerHTML = html || "No requests";
}

// function approve(i) {
//     let leaves = getLeaves();
//     let balances = getBalances();

//     let l = leaves[i];
//     l.status = "approved";

//     let start = new Date(l.start);
//     let end = new Date(l.end);
//     let days = Math.ceil((end - start) / (1000*60*60*24)) + 1;

//     if (l.type === "vacation") balances[l.userId].vacation -= days;
//     else balances[l.userId].sick -= days;

//     saveLeaves(leaves);
//     saveBalances(balances);

//     alert("Approved");
//     showAllLeaves();
// }
function approve(i) {
    let leaves = getLeaves();
    let balances = getBalances();

    let l = leaves[i];

    // If already approved, do nothing
    if (l.status === "approved") {
        alert("This leave is already approved");
        return;
    }

    l.status = "approved";

    let start = new Date(l.start);
    let end = new Date(l.end);
    let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // if (l.type === "vacation") {
    //     balances[l.userId].vacation -= days;
    // } else {
    //     balances[l.userId].sick -= days;
    // }
    if (l.type === "vacation") {
        balances[l.userId].vacation -= days;
    } else if (l.type === "sick") {
        balances[l.userId].sick -= days;
    } else if (l.type === "emergency") {
        balances[l.userId].emergency -= days;
    }

    saveLeaves(leaves);
    saveBalances(balances);

    alert("Approved");
    showAllLeaves();
}

function reject(i) {
    let leaves = getLeaves();
    leaves[i].status = "rejected";
    saveLeaves(leaves);
    alert("Rejected");
    showAllLeaves();
}

// remove localStorage data 
function resetDemo() {
    localStorage.removeItem("users");
    localStorage.removeItem("balances");
    localStorage.removeItem("leaves");
    localStorage.removeItem("user");
    location.href = "login.html";
}

