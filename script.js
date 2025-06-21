document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');
    let allPosts = [];

    const loadBlogPosts = async () => {
        try {
            const localData = localStorage.getItem('blogData');
            if (localData) {
                allPosts = JSON.parse(localData);
            } else {
                const res = await fetch('blogData.json');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                allPosts = await res.json();
            }
            displayPosts(allPosts);
        } catch (error) {
            console.error("Could not fetch blog posts:", error);
            blogGrid.innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
        }
    };

    const displayPosts = (posts) => {
        blogGrid.innerHTML = '';
        if (posts.length === 0) {
            blogGrid.innerHTML = '<p>No posts found matching your search.</p>';
            return;
        }

        posts.forEach((post, index) => {
            const postCard = document.createElement('div');
            postCard.classList.add('blog-card');
            postCard.innerHTML = `
                <img src="${post.thumbnailUrl}" alt="${post.title}" class="blog-card-thumbnail">
                <div class="blog-card-content">
                    <h2 class="blog-card-title">${post.title}</h2>
                    <a href="blog.html?id=${post.id}" class="read-more-btn">Read More</a>
                </div>
            `;
            blogGrid.appendChild(postCard);

            // ✅ Ad injected between blog posts (Your 320x50 Banner Code)
            if ((index + 1) % 2 === 0) {
                const adContainer = document.createElement('div');
                adContainer.classList.add('ad-container', 'ad-banner-320x50');
                adContainer.innerHTML = `
                    <script type="text/javascript">
                        atOptions = {
                            'key' : 'c4cfa7205583f65719312cbee578a1ba',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    <\/script>
                    <script type="text/javascript" src="//www.highperformanceformat.com/c4cfa7205583f65719312cbee578a1ba/invoke.js"><\/script>
                `;
                 blogGrid.appendChild(adContainer);
            }
        });
    };
    
    const filterPosts = () => {
        const query = searchInput.value.toLowerCase().trim();
        const filteredPosts = allPosts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(query);
            const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
            return titleMatch || tagMatch;
        });
        displayPosts(filteredPosts);
    };

    searchIcon.addEventListener('click', () => {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('input', filterPosts);

    loadBlogPosts();
});