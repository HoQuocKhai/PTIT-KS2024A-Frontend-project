document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail").value.trim();
    const passwordInput = document.getElementById("loginPassword").value;
    const errorDisplay = document.getElementById("loginError");

    errorDisplay.textContent = "";

    if (emailInput === "") {
        errorDisplay.textContent = "Email không được để trống";
        return;
    }

    if (passwordInput === "") {
        errorDisplay.textContent = "Mật khẩu không được để trống";
        return;
    }

    // Lấy dữ liệu từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.email !== emailInput || storedUser.password !== passwordInput) {
        errorDisplay.textContent = "Email hoặc mật khẩu không đúng";
        return;
    }

    // Đăng nhập thành công
    alert("Đăng nhập thành công!");
    window.location.href = "../js/index.html"; // chuyển về trang dashboard
});
