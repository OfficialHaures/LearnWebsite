document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const uploadForm = document.getElementById('uploadForm');
    const videosList = document.getElementById('videosList');

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (response.ok) {
                alert('Video uploaded successfully!');
                loadVideos();
                uploadForm.reset();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    });

    async function loadVideos() {
        try {
            const response = await fetch('/admin/videos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const videos = await response.json();
            
            videosList.innerHTML = videos.map(video => `
                <div class="video-item">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <button onclick="deleteVideo('${video._id}')">Delete Video</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load videos:', error);
        }
    }

    window.deleteVideo = async (videoId) => {
        if (confirm('Are you sure you want to delete this video?')) {
            try {
                const response = await fetch(`/admin/videos/${videoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    alert('Video deleted successfully');
                    loadVideos();
                }
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    loadVideos();
});
