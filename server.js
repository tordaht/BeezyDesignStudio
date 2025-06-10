const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const FsBackend = require('i18next-fs-backend');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// i18next Kurulumu
i18next
  .use(FsBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json'),
    },
    fallbackLng: 'tr',
    preload: ['tr', 'en'],
    detection: {
      order: ['path', 'cookie', 'header'],
      caches: ['cookie'],
      lookupCookie: 'lng-cookie',
      lookupFromPathIndex: 0
    },
    nonExplicitSupportedLngs: true,
    load: 'languageOnly'
  });

app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statik dosyaları (css, js, images) sunmak için
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware to make language and t function available in all templates
app.use((req, res, next) => {
    res.locals.t = req.t;
    res.locals.lng = req.language;
    res.locals.originalUrl = req.originalUrl.endsWith('/') ? req.originalUrl.slice(0, -1) : req.originalUrl;
    next();
});

// Admin Paneli için Basit Parola Koruması
const ADMIN_USER = 'beezy';
const ADMIN_PASS = 'beezy2025!'; // Lütfen bunu daha sonra değiştirin

app.use('/admin', (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === ADMIN_USER && password === ADMIN_PASS) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
});

// Admin sayfasını ve varlıklarını sun
app.use('/admin', express.static(path.join(__dirname, 'admin-panel'))); // Varsayımsal admin assetleri için
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Dinamik Veri Okuma (Dil Desteğiyle)
const readDb = (callback) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) return callback(err, null);
        callback(null, JSON.parse(data));
    });
};

// API Rotaları (Bunlar dil-bağımsız kalabilir)
app.get('/api/services', (req, res) => {
    readDb((err, db) => {
        if (err) return res.status(500).json({ message: 'Veritabanı okunamadı.' });
        res.json(db.services);
    });
});

// Hizmetler Güncelle (POST)
app.post('/api/services', (req, res) => {
    const newServices = req.body;
    readDb((err, db) => {
        if (err) return res.status(500).json({ message: 'Veritabanı okunamadı.' });
        db.services = newServices;
        fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ message: 'Veritabanına yazılamadı.' });
            res.json({ message: 'Hizmetler başarıyla güncellendi!' });
        });
    });
});

// Portfolyo Oku (GET)
app.get('/api/portfolio', (req, res) => {
    readDb((err, db) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı okunamadı.' });
        }
        res.json(db.portfolio);
    });
});

// Portfolyo Güncelle (POST)
app.post('/api/portfolio', (req, res) => {
    const newPortfolio = req.body;
    readDb((err, db) => {
        if (err) return res.status(500).json({ message: 'Veritabanı okunamadı.' });
        
        db.portfolio = newPortfolio;

        fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ message: 'Veritabanına yazılamadı.' });
            res.json({ message: 'Portfolyo başarıyla güncellendi!' });
        });
    });
});

// Blog Oku (GET)
app.get('/api/blog', (req, res) => {
    readDb((err, db) => {
        if (err) {
            return res.status(500).json({ message: 'Veritabanı okunamadı.' });
        }
        res.json(db.blog || []);
    });
});

// Blog Güncelle (POST)
app.post('/api/blog', (req, res) => {
    const newBlog = req.body;
    readDb((err, db) => {
        if (err) return res.status(500).json({ message: 'Veritabanı okunamadı.' });
        
        db.blog = newBlog;

        fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ message: 'Veritabanına yazılamadı.' });
            res.json({ message: 'Blog başarıyla güncellendi!' });
        });
    });
});

// Sayfa Sunma Rotaları (Dil Desteğiyle)
const supportedLangs = ['tr', 'en'];
const langRegex = `:lng(${supportedLangs.join('|')})`;

app.get('/', (req, res) => {
    // Tarayıcıdan veya cookie'den gelen dili kontrol et
    let detectedLng = req.language;
    // Eğer algılanan dil desteklenenler arasında değilse, varsayılana dön
    if (!supportedLangs.includes(detectedLng)) {
        detectedLng = 'tr';
    }
    res.redirect(`/${detectedLng}`);
});

app.get(`/${langRegex}`, (req, res) => {
    readDb((err, db) => {
        if (err) return res.status(500).send('Veritabanı okunamadı.');
        res.render('index', { services: db.services });
    });
});

app.get(`/${langRegex}/portfolio`, (req, res) => {
     readDb((err, db) => {
        if (err) return res.status(500).send('Veritabanı okunamadı.');
        res.render('portfolio', { portfolio: db.portfolio });
    });
});

app.get(`/${langRegex}/project-detail/:id`, (req, res) => {
    readDb((err, db) => {
        if (err) return res.status(500).send('Veritabanı okunamadı.');
        const project = db.portfolio.find(p => p.id === req.params.id);
        if (project) {
            res.render('project-detail', { project: project });
        } else {
            res.status(404).send('Proje bulunamadı.');
        }
    });
});

app.get(`/${langRegex}/blog`, (req, res) => {
    readDb((err, db) => {
       if (err) return res.status(500).send('Veritabanı okunamadı.');
       res.render('blog', { posts: db.blog || [] });
   });
});

app.get(`/${langRegex}/blog/:id`, (req, res) => {
    readDb((err, db) => {
        if (err) return res.status(500).send('Veritabanı okunamadı.');
        const post = db.blog.find(p => p.id === req.params.id);
        if (post) {
            res.render('blog-post', { post: post });
        } else {
            res.status(404).send('Yazı bulunamadı.');
        }
    });
});

app.get('/problemsnfixes', (req, res) => {
     res.render('problemsnfixes');
});

// .well-known gibi standart istekleri sessizce işle
app.get('/.well-known/*', (req, res) => {
    res.status(204).send();
});

// Sunucuyu Başlatma
app.listen(PORT, () => {
    console.log(`Beezy Studio sunucusu http://localhost:${PORT} adresinde çalışıyor. Seri No: ${Date.now()}`);
}); 