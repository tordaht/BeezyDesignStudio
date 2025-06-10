document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('blog-container');
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  posts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'blog-post space-y-4';
    article.innerHTML = `
      <img src="${post.image}" alt="${post.headline}" class="w-full rounded">
      <h2 class="text-2xl font-bold">${post.headline}</h2>
      <p class="text-gray-300">${post.text}</p>
    `;
    container.appendChild(article);
  });
});
