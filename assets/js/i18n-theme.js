// Language and theme handling
const translations = {
  tr: {
    navServices: 'Hizmetler',
    navProcess: 'Süreç',
    navProjects: 'Projeler',
    navBlog: 'Blog',
    navContact: 'İletişime Geç',
    heroTitle: 'İş Stratejilerini Sanata Dönüştüren Yaratıcı Ajans',
    heroSubtitle: 'Beezy, İstanbul merkezli bir tasarım stüdyosu olarak M.I.C.E., Motion Graphics ve 2D/3D Tasarım alanlarında markanızın potansiyelini ortaya çıkarır.',
    heroButton: 'Çalışmalarımızı Keşfet',
    servicesHeading: 'Hizmetlerimiz',
    servicesIntro: 'Stratejik Hedeflerinize Ulaşmanız İçin Yaratıcı Çözümler',
    processHeading: 'Yaklaşımımız',
    processIntro: 'Her Adımda Stratejik Sinerji',
    selectedProjects: 'Seçilmiş Projeler',
    createdValue: 'Markalar İçin Yarattığımız Değer',
    allFilter: 'Tümü',
    miceFilter: 'M.I.C.E.',
    designFilter: '2D & 3D Tasarım',
    mographFilter: 'Mograph & Video',
    adminLink: 'Admin Paneli'
  },
  en: {
    navServices: 'Services',
    navProcess: 'Process',
    navProjects: 'Projects',
    navBlog: 'Blog',
    navContact: 'Contact Us',
    heroTitle: 'Creative Agency Turning Business Strategies into Art',
    heroSubtitle: 'Based in Istanbul, Beezy unlocks your brand\'s potential in M.I.C.E., Motion Graphics and 2D/3D Design.',
    heroButton: 'Explore Our Work',
    servicesHeading: 'Our Services',
    servicesIntro: 'Creative Solutions to Reach Your Strategic Goals',
    processHeading: 'Our Approach',
    processIntro: 'Strategic Synergy at Every Step',
    selectedProjects: 'Featured Projects',
    createdValue: 'Value We Create for Brands',
    allFilter: 'All',
    miceFilter: 'M.I.C.E.',
    designFilter: '2D & 3D Design',
    mographFilter: 'Mograph & Video',
    adminLink: 'Admin Panel'
  }
};

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.documentElement.lang = lang;
}

async function detectLanguage() {
  let lang = localStorage.getItem('lang');
  if (!lang) {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      lang = data.country_code === 'TR' ? 'tr' : 'en';
    } catch (e) {
      lang = navigator.language.startsWith('tr') ? 'tr' : 'en';
    }
    localStorage.setItem('lang', lang);
  }
  applyTranslations(lang);
  const selector = document.getElementById('lang-toggle');
  if (selector) {
    selector.value = lang;
    selector.addEventListener('change', () => {
      const selected = selector.value;
      localStorage.setItem('lang', selected);
      applyTranslations(selected);
    });
  }
}

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const apply = th => {
    document.body.dataset.theme = th;
    localStorage.setItem('theme', th);
  };
  let theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  apply(theme);
  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      apply(theme);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  detectLanguage();
  initTheme();
});
