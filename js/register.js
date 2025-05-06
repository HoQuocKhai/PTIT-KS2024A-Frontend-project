if (!localStorage.getItem("users")) {
    const adminUser = {
        firstname: "Admin",
        lastname: "User",
        name: "Admin User",
        username: "@admin",
        email: "admin@gmail.com",
        password: "admin123",
        status: "Hoạt động",
        role: "admin",
    };

    const defaultUser1 = {
        firstname: "Minh",
        lastname: "Nguyen",
        name: "Minh Nguyen",
        username: "@minhnguyen",
        email: "minh@gmail.com",
        password: "123456",
        status: "Hoạt động",
        role: "user",
    };

    const defaultUser2 = {
        firstname: "Linh",
        lastname: "Tran",
        name: "Linh Tran",
        username: "@linhtran",
        email: "linh@gmail.com",
        password: "123456",
        status: "Hoạt động",
        role: "user",
    };

    localStorage.setItem("users", JSON.stringify([adminUser, defaultUser1, defaultUser2]));
}

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

    if (isValid) {
        // Lấy danh sách users hiện có từ localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Kiểm tra email đã tồn tại chưa
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            document.getElementById("error-email").textContent = "Email đã được sử dụng";
            return;
        }

        // Tạo user mới
        const newUser = {
            firstname,
            lastname,
            name: `${firstname} ${lastname}`,
            username: "@" + firstname.toLowerCase() + lastname.toLowerCase(),
            email,
            password,
            status: "Hoạt động",
            role: "user"
        };

        // Thêm vào danh sách & lưu lại
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    }
});
