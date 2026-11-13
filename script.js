let allPosts = [];
let currentCategory = 'All';

// পোস্ট লোড
fetch('./posts.json')
    .then(res => res.json())
    .then(data => {
        allPosts = data;
        renderCategories();
        renderPosts(allPosts);
    })
    .catch(err => {
        document.getElementById('postsGrid').innerHTML =
            '<p style="text-align:center;grid-column:1/-1;">পোস্ট লোড করতে সমস্যা হয়েছে। লোকাল সার্ভার ব্যবহার করুন।</p>';
    });

// ক্যাটাগরি বাটন তৈরি
function renderCategories() {
    const cats = ['All', ...new Set(allPosts.map(p => p.category))];
    const container = document.getElementById('categoryFilter');
    container.innerHTML = cats.map(cat =>
        `<button class="cat-btn ${cat === 'All' ? 'active' : ''}" data-cat="${cat}">
            ${cat === 'All' ? 'সব' : cat}
        </button>`
    ).join('');

    container.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            filterAndRender();
        });
    });
}

// পোস্ট রেন্ডার
function renderPosts(posts) {
    const grid = document.getElementById('postsGrid');
    if (posts.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;">কোনো পোস্ট পাওয়া যায়নি।</p>';
        return;
    }
    grid.innerHTML = posts.map(post => `
        <div class="post-card" onclick="location.href='post.html?id=${post.id}'">
            <img src="${post.image}" alt="${post.title}">
            <div class="post-card-body">
                <span class="category">${post.category}</span>
                <h3>${post.title}</h3>
                <p class="excerpt">${post.excerpt}</p>
                <div class="meta">📅 ${post.date} | ✍️ ${post.author}</div>
            </div>
        </div>
    `).join('');
}

// ফিল্টার ও সার্চ
function filterAndRender() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allPosts;
    if (currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (term) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(term) ||
            p.excerpt.toLowerCase().includes(term)
        );
    }
    renderPosts(filtered);
}

document.getElementById('searchInput').addEventListener('input', filterAndRender);
