document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const uploadSection = document.getElementById('uploadSection');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                showUploadSection();
                loadVideos();
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });
            
            if (response.ok) {
                alert('Registration successful! Please login.');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    });

    const uploadForm = document.querySelector('.upload-section form');
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            
            if (response.ok) {
                alert('Video uploaded successfully!');
                loadVideos();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    });

    async function loadVideos() {
        try {
            const response = await fetch('/videos');
            const videos = await response.json();
            const videosGrid = document.getElementById('videosGrid');
            
            videosGrid.innerHTML = videos.map(video => `
                <div class="video-card">
                    <video controls>
                        <source src="/uploads/${video.filename}" type="video/mp4">
                    </video>
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load videos:', error);
        }
    }

    loadVideos();
});
