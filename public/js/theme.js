// İkonlar ve Buton
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Tema kontrolü ve uygulama
function applyTheme() {
    const isDarkMode = localStorage.getItem('color-theme') === 'dark' || 
                       (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
    }
}

// Sayfa yüklendiğinde temayı uygula
document.addEventListener('DOMContentLoaded', applyTheme);

// Butona tıklama olayı
themeToggleBtn.addEventListener('click', () => {
    // Mevcut durumu kontrol et
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
        // Light moda geç
        localStorage.setItem('color-theme', 'light');
    } else {
        // Dark moda geç
        localStorage.setItem('color-theme', 'dark');
    }

    // Temayı yeniden uygula
    applyTheme();
}); 