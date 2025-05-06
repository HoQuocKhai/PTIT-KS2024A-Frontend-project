document.addEventListener("DOMContentLoaded", function () {
    // user_manager.js
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const rowsPerPage = 2; // <= Thay đổi ở đây
    let currentPage = 1;

    function renderUsers(userList) {
        const tbody = document.getElementById("user-table");
        tbody.innerHTML = "";
    
        const filteredUsers = userList.filter(user => user.role !== "admin");
        const paginatedUsers = paginateUsers(filteredUsers, currentPage);
    
        paginatedUsers.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="table_name" onclick="goToProfile('${user.id}')">
                    <img src="${user.avatarPath || '../assets/images/Avatar.png'}" alt="Avatar" class="table-avatar me-3">
                    <div class="user-info">
                        <p class="name mb-0 fw-semibold" data-user-id="${user.id}">
                            ${user.name || "Chưa có tên"}
                        </p>
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

        renderPagination(filteredUsers.length);
    }

    function paginateUsers(users, page) {
        const start = (page - 1) * rowsPerPage;
        const end = page * rowsPerPage;
        return users.slice(start, end);
    }

    function renderPagination(totalUsers) {
        const pageCount = Math.ceil(totalUsers / rowsPerPage);
        const pagination = document.querySelector(".pagination .page-numbers");
        pagination.innerHTML = "";

        for (let i = 1; i <= pageCount; i++) {
            const pageItem = document.createElement("li");
            pageItem.innerHTML = `<a href="#" class="page ${i === currentPage ? "active" : ""}">${i}</a>`;
            pageItem.querySelector("a").addEventListener("click", function (e) {
                e.preventDefault();
                currentPage = i;
                renderUsers(users);
            });
            pagination.appendChild(pageItem);
        }
        document.querySelector(".pagination .arrow:first-child").addEventListener("click", function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderUsers(users);
            }
        });
        
        document.querySelector(".pagination .arrow:last-child").addEventListener("click", function (e) {
            e.preventDefault();
            const pageCount = Math.ceil(users.filter(user => user.role !== "admin").length / rowsPerPage);
            if (currentPage < pageCount) {
                currentPage++;
                renderUsers(users);
            }
        });
        
    }

    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderUsers(filteredUsers);
    }

    let isSortedAsc = true;
    function sortUsers() {
        users = users.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return isSortedAsc ? -1 : 1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return isSortedAsc ? 1 : -1;
            return 0;
        });
        isSortedAsc = !isSortedAsc;
        renderUsers(users);
    }

    document.getElementById("search-input").addEventListener("input", handleSearch);
    document.querySelectorAll(".sort-btn").forEach(btn => btn.addEventListener("click", sortUsers));

    renderUsers(users);
});
