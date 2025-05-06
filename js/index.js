// ===== BIẾN TOÀN CỤC =====
const signupBtn = document.getElementById("signupBtn");
const signinBtn = document.getElementById("signinBtn");
const userGreeting = document.getElementById("userGreeting");
const usernameDisplay = document.getElementById("usernameDisplay");
const logoutBtn = document.getElementById("logoutBtn");
const postContainer = document.getElementById("postContainer");


// ====== ĐĂNG NHẬP / ĐĂNG XUẤT ======
function checkLoginStatus() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");

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
checkLoginStatus()

function logout() {
    sessionStorage.removeItem("loggedInUser");
    checkLoginStatus();
    alert("Bạn đã đăng xuất!");
}

function handleSubmit(event) {
    event.preventDefault(); // Ngăn chặn trang reload
    
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("Bạn cần đăng nhập để thêm bài viết!");
        return;
    }
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
            id: Date.now(), // ID duy nhất cho bài viết mới
            title,
            category,
            mood,
            content,
            status,
            imageUrl,
            date: new Date().toISOString().split('T')[0],
        };

        // Lưu bài viết mới vào localStorage
        const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
        posts.unshift(newPost); // Thêm bài viết vào đầu danh sách
        localStorage.setItem("userPosts", JSON.stringify(posts));

        alert("Bài viết đã được thêm!");
        document.getElementById("addPostForm").reset(); // Reset form
        document.querySelector('#addArticleModal .btn-close').click(); // Đóng modal
    };

    if (image) {
        reader.readAsDataURL(image); // Đọc file ảnh nếu có
    } else {
        // Nếu không có ảnh, tiếp tục mà không cần xử lý ảnh
        const newPost = {
            id: Date.now(),
            title,
            category,
            mood,
            content,
            status,
            imageUrl: null,
            date: new Date().toISOString().split('T')[0],
        };

        // Lưu bài viết không có ảnh vào localStorage
        const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
        posts.unshift(newPost); 
        localStorage.setItem("userPosts", JSON.stringify(posts));

        alert("Bài viết đã được thêm!");
        document.getElementById("addPostForm").reset();
        document.querySelector('#addArticleModal .btn-close').click();
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
            <div class="card mb-4" onclick="viewPostDetail(${post.id})" style="cursor: pointer;">
                <img src="${post.imageUrl || '../assets/images/Bài viết 1.png'}" class="card-img-top" alt="Post image">
                <div class="card-body">
                    <p class="text-muted">📅 ${post.date}</p>
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content.substring(0, 100)}...</p>
                    <span class="badge bg-warning text-dark">${post.mood}</span>
                </div>
            </div>
        `;

    });

    postContainer.innerHTML = html;
}




function viewPostDetail(postId) {
    const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    const selectedPost = posts.find(p => p.id === postId);
    localStorage.setItem("selectedPost", JSON.stringify(selectedPost));
    window.location.href = `../html/post_detail.html?id=${postId}`;
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
    checkLoginStatus();
    renderCategoryLinks();
    const allPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    renderPosts(allPosts);
  };
  
