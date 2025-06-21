document.addEventListener('DOMContentLoaded', () => {
    const blogTitle = document.getElementById('blog-title');
    const blogThumbnail = document.getElementById('blog-thumbnail');
    const blogContent = document.getElementById('blog-content');
    const mainContent = document.querySelector('.blog-post-container');

    // Get blog ID from URL query parameter
    const getPostId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    const loadBlogPost = async () => {
        const postId = getPostId();
        if (!postId) {
            mainContent.innerHTML = '<h1>Blog post not found.</h1><p>Please return to the <a href="index.html">homepage</a>.</p>';
            return;
        }

        try {
            // Check localStorage first
            let allPosts = [];
            const localData = localStorage.getItem('blogData');
            if (localData) {
                allPosts = JSON.parse(localData);
            } else {
                const res = await fetch('blogData.json');
                 if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                allPosts = await res.json();
            }

            // Find the specific post by ID
            // The ID from URL is a string, so we need to compare loosely (==) or convert
            const post = allPosts.find(p => p.id == postId);

            if (post) {
                document.title = `${post.title} - RajGuideline`;
                blogTitle.textContent = post.title;
                blogThumbnail.src = post.thumbnailUrl;
                blogThumbnail.alt = post.title;
                blogContent.innerHTML = post.content; // Use innerHTML to render HTML tags from JSON
            } else {
                mainContent.innerHTML = '<h1>Blog post not found.</h1><p>The requested post does not exist. Return to the <a href="index.html">homepage</a>.</p>';
            }
        } catch (error) {
            console.error("Could not load blog post:", error);
            mainContent.innerHTML = '<h1>Error</h1><p>Could not load the blog post. Please check your connection and try again.</p>';
        }
    };

    loadBlogPost();
});