if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initApp();
    });
} else {
    initApp();
}

// Hàm chuyển file ảnh thành base64
async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function initApp() {
    const addArticleForm = document.querySelector("#addArticleModal form");
    const table = document.querySelector(".post-table");
    const pagination = document.querySelector(".pagination");
    let currentPage = 1;
    const postsPerPage = 2;
    // Nếu chưa có bài viết nào thì tạo sẵn 3 bài viết mẫu
    if (!localStorage.getItem("posts")) {
        const samplePosts = [
            {
                title: "Khám phá công nghệ AI",
                category: "Công nghệ",
                mood: "Hào hứng",
                content: "AI đang thay đổi thế giới với tốc độ chóng mặt...",
                status: "public",
                image: "../assets/images/Image (1).png"
            },
            {
                title: "Chuyến đi Đà Lạt đáng nhớ",
                category: "Du lịch",
                mood: "Thư giãn",
                content: "Đà Lạt thật tuyệt vời với không khí mát mẻ và cảnh đẹp thơ mộng...",
                status: "private",
                image: "../assets/images/Image (2).png"
            },
            {
                title: "Mẹo học lập trình hiệu quả",
                category: "Học tập",
                mood: "Tự tin",
                content: "Việc học lập trình không quá khó nếu bạn biết cách tiếp cận đúng...",
                status: "public",
                image: "../assets/images/Image (3).png"
            }
        ];
        localStorage.setItem("posts", JSON.stringify(samplePosts));
    }

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

        // Xóa tất cả các dòng trong bảng (trừ header)
        const tableRows = table.querySelectorAll("tr");
        tableRows.forEach((row, idx) => { if (idx > 0) row.remove(); });

        // Thêm bài viết vào bảng
        const rows = postsForPage.map((post, index) => {
            const absoluteIndex = (currentPage - 1) * postsPerPage + index;
            const imageSrc = post.image || "../assets/images/default.png";
            return `
                <tr>
                    <td><img src="${imageSrc}" 
                             onerror="this.src='../assets/images/default.png'"
                             style="width:100px;height:70px;object-fit:cover;"></td>
                    <td>${post.title}</td>
                    <td>${post.category}</td>
                    <td>${post.content}</td>
                    <td>
                        <span class="status-badge ${post.status === 'public' ? 'public' : 'private'}">
                            ${post.status === 'public' ? 'Public' : 'Private'}
                        </span>
                    </td>
                    <td>
                        <select data-index="${absoluteIndex}" class="status-select">
                            <option value="public" ${post.status === "public" ? "selected" : ""}>Public</option>
                            <option value="private" ${post.status === "private" ? "selected" : ""}>Private</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit-btn btn btn-warning btn-sm" data-index="${absoluteIndex}">Sửa</button>
                        <button class="delete-btn btn btn-danger btn-sm" data-index="${absoluteIndex}">Xóa</button>
                    </td>
                </tr>
            `;
        }).join("");

        table.insertAdjacentHTML('beforeend', rows);
        renderPagination();
        attachEventListeners();
    }

    // Hàm render phân trang
    function renderPagination() {
        const totalPages = Math.ceil(posts.length / postsPerPage);
        pagination.innerHTML = `
            <a href="#" class="arrow ${currentPage === 1 ? 'disabled' : ''}">← Previous</a>
            <ul class="page-numbers">
                ${Array.from({ length: totalPages }, (_, i) => `
                    <li><a href="#" class="page ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</a></li>
                `).join('')}
            </ul>
            <a href="#" class="arrow ${currentPage === totalPages ? 'disabled' : ''}">Next →</a>
        `;

        document.querySelectorAll(".page").forEach(page => {
            page.addEventListener("click", function (e) {
                e.preventDefault();
                currentPage = parseInt(this.dataset.page);
                renderPosts();
            });
        });

        document.querySelector(".pagination .arrow:first-child")?.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderPosts();
            }
        });

        document.querySelector(".pagination .arrow:last-child")?.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderPosts();
            }
        });
    }

    function attachEventListeners() {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(this.dataset.index);
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
                const index = parseInt(this.dataset.index);
                if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                    posts.splice(index, 1);
                    savePosts();
                    renderPosts();
                }
            });
        });

        document.querySelectorAll(".status-select").forEach(select => {
            select.addEventListener("change", function () {
                const index = parseInt(this.dataset.index);
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

    addArticleForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const title = this.title.value.trim();
        const category = this.category.value.trim();
        const mood = this.mood.value.trim();
        const content = this.content.value.trim();
        const status = this.status.value;
        const imageInput = this.image;
        let image = "";

        if (imageInput.files.length > 0) {
            image = await getBase64(imageInput.files[0]);
        }

        if (editingPostIndex !== null) {
            posts[editingPostIndex] = {
                ...posts[editingPostIndex],
                title,
                category,
                mood,
                content,
                status
            };
            if (image) {
                posts[editingPostIndex].image = image;
            }
            editingPostIndex = null;
        } else {
            posts.push({ title, category, mood, content, status, image });
        }

        savePosts();
        renderPosts();
        this.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addArticleModal"));
        modal.hide();
    });

    renderPosts();
}