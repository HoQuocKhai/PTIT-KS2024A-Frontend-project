document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Input values
    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Clear all error messages
    document.querySelectorAll(".error").forEach(e => e.textContent = "");

    let isValid = true;

    // Validation
    if (firstname === "") {
        document.getElementById("error-firstname").textContent = "Họ không được để trống";
        isValid = false;
    }
    if (lastname === "") {
        document.getElementById("error-lastname").textContent = "Tên không được để trống";
        isValid = false;
    }

    if (email === "") {
        document.getElementById("error-email").textContent = "Email không được để trống";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("error-email").textContent = "Email không đúng định dạng";
        isValid = false;
    }

    if (password === "") {
        document.getElementById("error-password").textContent = "Mật khẩu không được để trống";
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById("error-password").textContent = "Mật khẩu tối thiểu 6 ký tự";
        isValid = false;
    }

    if (confirmPassword === "") {
        document.getElementById("error-confirmPassword").textContent = "Xác nhận mật khẩu không được để trống";
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("error-confirmPassword").textContent = "Mật khẩu xác nhận không khớp";
        isValid = false;
    }

    // Nếu hợp lệ, lưu vào localStorage & chuyển hướng
    if (isValid) {
        const user = {
            firstname,
            lastname,
            email,
            password,
        };

        localStorage.setItem("user", JSON.stringify(user));
        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    }
});
