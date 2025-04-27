if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initApp();
    });
} else {
    initApp();
}

function initApp() {
    const addArticleForm = document.querySelector("#addArticleModal form");
    const table = document.querySelector(".post-table");
    const pagination = document.querySelector(".pagination");
    let currentPage = 1;
    const postsPerPage = 2;

    // Lấy bài viết từ localStorage
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let editingPostIndex = null;

    // Hàm phân trang
    function getPostsForCurrentPage() {
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        return posts.slice(start, end);
    }

    // Hàm render bài viết
    function renderPosts() {
        const postsForPage = getPostsForCurrentPage();

        // Xóa tất cả các dòng trong bảng
        const rows = postsForPage.map((post, index) => `
            <tr>
                <td><img src="${post.image || "../assets/images/default.png"}" style="width:100px;height:70px;object-fit:cover;"></td>
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${post.content}</td>
                <td>${post.status === "public" ? "Public" : "Private"}</td>
                <td>
                    <select data-index="${index}" class="status-select">
                        <option value="public" ${post.status === "public" ? "selected" : ""}>Public</option>
                        <option value="private" ${post.status === "private" ? "selected" : ""}>Private</option>
                    </select>
                </td>
                <td>
                    <button class="edit-btn btn btn-warning btn-sm" data-index="${index}">Sửa</button>
                    <button class="delete-btn btn btn-danger btn-sm" data-index="${index}">Xóa</button>
                </td>
            </tr>
        `).join("");

        // Thêm bài viết vào bảng
        const tableRows = table.querySelectorAll("tr");
        tableRows.forEach((row, idx) => { if (idx > 0) row.remove(); });

        table.insertAdjacentHTML('beforeend', rows);

        // Render phân trang
        renderPagination();
        attachEventListeners();
    }

    // Hàm render phân trang
    function renderPagination() {
        const totalPages = Math.ceil(posts.length / postsPerPage);
        pagination.innerHTML = `
            <a href="#" class="arrow" ${currentPage === 1 ? 'class="disabled"' : ''}>← Previous</a>
            <ul class="page-numbers">
                ${Array.from({ length: totalPages }, (_, i) => `
                    <li><a href="#" class="page ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</a></li>
                `).join('')}
            </ul>
            <a href="#" class="arrow" ${currentPage === totalPages ? 'class="disabled"' : ''}>Next →</a>
        `;

        document.querySelectorAll(".page").forEach(page => {
            page.addEventListener("click", function () {
                currentPage = parseInt(this.dataset.page);
                renderPosts();
            });
        });

        document.querySelector(".pagination .arrow:first-child")?.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderPosts();
            }
        });

        document.querySelector(".pagination .arrow:last-child")?.addEventListener("click", function () {
            if (currentPage < totalPages) {
                currentPage++;
                renderPosts();
            }
        });
    }

    function attachEventListeners() {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                const post = posts[index];

                editingPostIndex = index;

                document.getElementById("title").value = post.title;
                document.getElementById("category").value = post.category;
                document.getElementById("mood").value = post.mood;
                document.getElementById("content").value = post.content;

                if (post.status === "public") {
                    document.getElementById("statusPublic").checked = true;
                } else {
                    document.getElementById("statusPrivate").checked = true;
                }

                const addModal = new bootstrap.Modal(document.getElementById('addArticleModal'));
                addModal.show();
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                    posts.splice(index, 1);
                    savePosts();
                    renderPosts();
                }
            });
        });

        document.querySelectorAll(".status-select").forEach(select => {
            select.addEventListener("change", function () {
                const index = this.dataset.index;
                posts[index].status = this.value;
                savePosts();
                renderPosts();
            });
        });
    }

    // Lưu bài viết vào localStorage
    function savePosts() {
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    addArticleForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = this.title.value.trim();
        const category = this.category.value.trim();
        const mood = this.mood.value.trim();
        const content = this.content.value.trim();
        const status = this.status.value;
        const imageInput = this.image;
        let image = "";

        if (imageInput.files.length > 0) {
            image = URL.createObjectURL(imageInput.files[0]);
        }

        if (editingPostIndex !== null) {
            posts[editingPostIndex] = { title, category, mood, content, status, image: posts[editingPostIndex].image };
            if (image) {
                posts[editingPostIndex].image = image;
            }
            editingPostIndex = null;
        } else {
            posts.unshift({ title, category, mood, content, status, image });
        }

        savePosts(); // Lưu bài viết vào localStorage
        renderPosts();
        this.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addArticleModal"));
        modal.hide();
    });

    renderPosts();
}
