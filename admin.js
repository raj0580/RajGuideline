document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.querySelector('.admin-panel');
    const blogForm = document.getElementById('blog-form');
    const formTitle = document.getElementById('form-title');
    const postIdInput = document.getElementById('post-id');
    const titleInput = document.getElementById('title');
    const thumbnailInput = document.getElementById('thumbnail');
    const tagsInput = document.getElementById('tags');
    const contentInput = document.getElementById('content');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const postsListContainer = document.getElementById('posts-list');
    const exportBtn = document.getElementById('export-json-btn');
    const jsonOutput = document.getElementById('json-output');

    let blogData = [];
    const ADMIN_PASSWORD = "rajadmin580";

    // --- 1. AUTHENTICATION ---
    const checkAuth = () => {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            adminPanel.style.display = 'block';
            loadDataAndRender();
            return;
        }

        const password = prompt("Enter admin password:");
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            adminPanel.style.display = 'block';
            loadDataAndRender();
        } else {
            alert("Access Denied. Incorrect password.");
            document.body.innerHTML = '<div class="container" style="text-align:center; padding-top: 50px;"><h1>Access Denied</h1><p><a href="index.html">Go to Homepage</a></p></div>';
        }
    };

    // --- 2. DATA HANDLING ---
    const loadDataAndRender = async () => {
        try {
            const localData = localStorage.getItem('blogData');
            if (localData) {
                blogData = JSON.parse(localData);
            } else {
                const res = await fetch('blogData.json');
                blogData = await res.json();
                saveData(); // Save fetched data to localStorage initially
            }
            renderPostsList();
        } catch (error) {
            console.error("Error loading blog data:", error);
            postsListContainer.innerHTML = "<p>Error loading data.</p>";
        }
    };

    const saveData = () => {
        localStorage.setItem('blogData', JSON.stringify(blogData));
    };

    // --- 3. RENDERING ---
    const renderPostsList = () => {
        postsListContainer.innerHTML = '';
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        blogData.slice().reverse().forEach(post => { // Show newest first
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.title}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" data-id="${post.id}" onclick="editPost(this)">Edit</button>
                    <button class="btn btn-danger btn-sm" data-id="${post.id}" onclick="deletePost(this)">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        postsListContainer.appendChild(table);
    };

    // --- 4. CRUD OPERATIONS ---
    blogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const post = {
            id: postIdInput.value ? Number(postIdInput.value) : Date.now(),
            title: titleInput.value.trim(),
            thumbnailUrl: thumbnailInput.value.trim(),
            tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean),
            content: contentInput.value.trim()
        };

        if (postIdInput.value) { // Update existing post
            const index = blogData.findIndex(p => p.id == post.id);
            if (index !== -1) {
                blogData[index] = post;
            }
        } else { // Add new post
            blogData.push(post);
        }

        saveData();
        renderPostsList();
        resetForm();
    });

    window.editPost = (button) => {
        const postId = button.getAttribute('data-id');
        const post = blogData.find(p => p.id == postId);
        if (!post) return;

        formTitle.textContent = "Edit Blog Post";
        postIdInput.value = post.id;
        titleInput.value = post.title;
        thumbnailInput.value = post.thumbnailUrl;
        tagsInput.value = post.tags.join(', ');
        contentInput.value = post.content;
        formSubmitBtn.textContent = "Update Post";
        cancelEditBtn.style.display = 'inline-block';
        window.scrollTo(0, 0); // Scroll to top to see form
    };
    
    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        blogForm.reset();
        formTitle.textContent = "Add New Blog Post";
        postIdInput.value = '';
        formSubmitBtn.textContent = "Save Post";
        cancelEditBtn.style.display = 'none';
    }

    window.deletePost = (button) => {
        const postId = button.getAttribute('data-id');
        if (confirm("Are you sure you want to delete this post?")) {
            blogData = blogData.filter(p => p.id != postId);
            saveData();
            renderPostsList();
            resetForm(); // In case it was being edited
        }
    };

    // --- 5. EXPORT FUNCTIONALITY ---
    exportBtn.addEventListener('click', () => {
        jsonOutput.value = JSON.stringify(blogData, null, 2);
        jsonOutput.style.display = 'block';
        jsonOutput.select();
        alert("JSON data is ready in the text area below. Copy it and update your blogData.json file.");
    });
    
    // --- INITIALIZE ---
    checkAuth();
});