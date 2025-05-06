function handleLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail").value.trim();
    const passwordInput = document.getElementById("loginPassword").value;
    const errorDisplay = document.getElementById("loginError");

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    errorDisplay.textContent = "";

    if (!emailInput) {
        errorDisplay.textContent = "Email không được để trống";
        return;
    }
    if (!passwordInput) {
        errorDisplay.textContent = "Mật khẩu không được để trống";
        return;
    }

    if (storedUsers.length === 0) {
        errorDisplay.textContent = "Tài khoản chưa được đăng ký!";
        return;
    }

    const user = storedUsers.find(user => user.email === emailInput && user.password === passwordInput);

    if (!user) {
        errorDisplay.textContent = "Email hoặc mật khẩu không đúng";
        return;
    }

    sessionStorage.setItem("loggedInUser", user.name);

    alert(`Đăng nhập thành công! Chào ${user.name}`);

    if (user.role === "admin") {
        window.location.href = "/html/user_manager.html";
    } else {
        window.location.href = "/index.html";
    }
}
