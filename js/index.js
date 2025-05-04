// ===== BIẾN TOÀN CỤC =====
const signupBtn = document.getElementById("signupBtn");
const signinBtn = document.getElementById("signinBtn");
const userGreeting = document.getElementById("userGreeting");
const usernameDisplay = document.getElementById("usernameDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const postContainer = document.getElementById("postContainer");


// ====== ĐĂNG NHẬP / ĐĂNG XUẤT ======
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        signupBtn.style.display = "none";
        signinBtn.style.display = "none";
        userGreeting.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";
        usernameDisplay.textContent = loggedInUser;
    } else {
        signupBtn.style.display = "inline-block";
        signinBtn.style.display = "inline-block";
        userGreeting.style.display = "none";
        logoutBtn.style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    checkLoginStatus();
}
function handleSubmit(event) {
    event.preventDefault(); // Ngăn reload trang

    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const mood = document.getElementById('mood').value;
    const content = document.getElementById('content').value;
    const status = document.querySelector('input[name="status"]:checked')?.value;
    const imageInput = document.getElementById('image');
    const image = imageInput.files[0];

    if (!title || !category || !content || !status) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageUrl = e.target.result;

        const newPost = {
            title,
            category,
            mood,
            content,
            status,
            imageUrl,
            date: new Date().toISOString().split('T')[0],
        };

        // Lưu vào localStorage
        const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
        posts.unshift(newPost);
        localStorage.setItem("userPosts", JSON.stringify(posts));

        alert("Bài viết đã được thêm!");
        document.getElementById("addPostForm").reset();
        document.querySelector('#addArticleModal .btn-close').click(); // Đóng modal

        // Hàm gọi lại để hiển thị danh sách bài viết
        renderPosts(); 
    };

    if (image) {
        reader.readAsDataURL(image);
    } else {
        reader.onload({ target: { result: '' } }); // Không có ảnh
    }
}

function renderPosts(postsToRender = null) {
    const postContainer = document.getElementById("postContainer");
    const posts = postsToRender || JSON.parse(localStorage.getItem("userPosts") || "[]");

    if (posts.length === 0) {
        postContainer.innerHTML = "<p>Chưa có bài viết nào.</p>";
        return;
    }

    let html = "";

    posts.forEach((post, index) => {
        html += `
            <div class="card mb-4" onclick="window.location.href='../html/post_detail.html?id=${index}'" style="cursor: pointer;">
                <img src="${post.imageUrl || '../assets/images/default.png'}" class="card-img-top" alt="Post image">
                <div class="card-body">
                    <p class="text-muted">📅 ${post.date}</p>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content.substring(0, 100)}...</p>
                    <span class="badge bg-primary">${post.category}</span>
                    <span class="badge bg-success">${post.status}</span>
                    <span class="badge bg-warning text-dark">${post.mood}</span>
                </div>
            </div>
        `;
    });

    postContainer.innerHTML = html;
}


function viewPostDetail(index) {
    const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    localStorage.setItem("selectedPost", JSON.stringify(posts[index]));
    window.location.href = "./post_detail.html";
}

function renderCategoryLinks() {
    // Lấy danh sách các chủ đề từ localStorage
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");

    // Tìm phần tử chứa các link chủ đề trong HTML
    const nav = document.getElementById("categoryNav");

    // Reset nội dung ban đầu
    nav.innerHTML = '';

    // Thêm nút "All blog posts" (hiển thị tất cả bài viết)
    const allBtn = document.createElement("a");
    allBtn.href = "#";
    allBtn.textContent = "All blog posts";
    allBtn.onclick = () => filterByCategory("all");
    nav.appendChild(allBtn);

    // Thêm các nút theo từng category
    categories.forEach(cat => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = cat;
        link.onclick = () => filterByCategory(cat);
        nav.appendChild(link);
    });
}

function filterByCategory(category) {
    const allPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");

    if (category === "all") {
        renderPosts(allPosts);
    } else {
        const filtered = allPosts.filter(post => post.category === category);
        renderPosts(filtered);
    }
}



window.onload = () => {
    renderCategoryLinks();  // Gọi hàm hiển thị các chủ đề
    const allPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    renderPosts(allPosts);  // Hiển thị tất cả bài viết
};
