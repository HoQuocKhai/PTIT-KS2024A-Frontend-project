document.addEventListener("DOMContentLoaded", function () {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    function renderUsers(userList) {
        const tbody = document.getElementById("user-table");
        tbody.innerHTML = "";

        // Bỏ qua tài khoản admin
        const filteredUsers = userList.filter(user => user.role !== "admin");

        filteredUsers.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="table_name">
                    <img src="../assets/images/Avatar.png" alt="Avatar" class="table-avatar me-3">
                    <div class="user-info">
                        <p class="name mb-0 fw-semibold">${user.name || "Chưa có tên"}</p>
                        <p class="username mb-0 text-muted">${user.username || ""}</p>
                    </div>
                </td>
                <td>${user.status || "Chưa xác định"}</td>
                <td>${user.email}</td>
                <td>
                    <button>Block</button>
                    <button>Unblock</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderUsers(users);
});
