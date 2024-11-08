const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [req.body.username, req.body.email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const video = new Video({
            title: req.body.title,
            description: req.body.description,
            filename: req.file.filename,
            uploadedBy: req.user._id
        });
        await video.save();
        res.status(201).json({ message: 'Video uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find().populate('uploadedBy', 'username');
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const mysql = require('mysql2/promise');

// MySQL connection
const pool = mysql.createPool({
    host: '185.228.82.169:3306',
    user: 'u13_Uy4wZJi54i',
    password: 'dVN^SY^c0pbdxKH^m20o0pvD',
    database: 's13_LearnWebsite'
});

app.use(express.json());
app.use(express.static('public'));
