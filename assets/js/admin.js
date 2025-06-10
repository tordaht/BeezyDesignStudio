document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file-input');
  const headlineInput = document.getElementById('headline');
  const contentInput = document.getElementById('content');
  const saveBtn = document.getElementById('save-btn');

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(event => {
    dropArea.addEventListener(event, e => {
      preventDefaults(e);
      dropArea.classList.add('bg-gray-700');
    });
  });
  ['dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, e => {
      preventDefaults(e);
      dropArea.classList.remove('bg-gray-700');
    });
  });

  dropArea.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    if (files.length) {
      fileInput.files = files;
      previewFile();
    }
  });
  dropArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', previewFile);

  function previewFile() {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      dropArea.style.backgroundImage = `url(${reader.result})`;
      dropArea.textContent = '';
      dropArea.dataset.image = reader.result;
    };
    reader.readAsDataURL(file);
  }

  saveBtn.addEventListener('click', () => {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    posts.push({
      image: dropArea.dataset.image || '',
      headline: headlineInput.value,
      text: contentInput.value
    });
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    headlineInput.value = '';
    contentInput.value = '';
    dropArea.style.backgroundImage = '';
    dropArea.textContent = 'G\u00f6rsel y\u00fckleyin (800x600px)';
    dropArea.removeAttribute('data-image');
    alert('Blog yaz\u0131s\u0131 kaydedildi');
  });
});
