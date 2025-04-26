document.addEventListener("DOMContentLoaded", function () {
    const addCategoryForm = document.getElementById("add-category-form");
    const categoryInput = document.getElementById("category-input");
    const categoryTableBody = document.getElementById("category-table-body");

    let categories = JSON.parse(localStorage.getItem("categories")) || [];

    function renderCategories() {
        categoryTableBody.innerHTML = "";

        categories.forEach((category, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td class="category-name">${category}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        // Xử lý xóa
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                if (confirm("Bạn có chắc muốn xóa chủ đề này?")) {
                    categories.splice(index, 1);
                    saveAndRender();
                }
            });
        });

        // Xử lý chỉnh sửa
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                const currentName = categories[index];

                const newName = prompt("Nhập tên mới cho chủ đề:", currentName);
                if (newName && newName.trim() !== "") {
                    categories[index] = newName.trim();
                    saveAndRender();
                }
            });
        });
    }

    function saveAndRender() {
        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategories();
    }

    addCategoryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const categoryName = categoryInput.value.trim();
        if (categoryName !== "") {
            categories.push(categoryName);
            categoryInput.value = "";
            saveAndRender();
        }
    });

    renderCategories();
});
