// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const uploadButton = document.getElementById('upload-button');
    const statusMessage = document.getElementById('status-message');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const previewUrl = document.getElementById('preview-url');
    const imageFileInput = document.getElementById('image-file');
    
    // 监听文件选择事件，显示本地预览
    imageFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 监听表单提交事件
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const githubToken = document.getElementById('github-token').value;
        const githubUsername = document.getElementById('github-username').value;
        const githubRepo = document.getElementById('github-repo').value;
        const githubBranch = document.getElementById('github-branch').value || 'main';
        const imageFile = document.getElementById('image-file').files[0];
        const uploaderName = document.getElementById('uploader-name').value;
        
        // 显示上传状态
        uploadButton.disabled = true;
        uploadButton.textContent = '上传中...';
        showStatus('正在上传图片，请稍候...', 'success');
        
        // 读取图片文件并转换为base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result.split(',')[1]; // 移除data URL前缀
            uploadToGitHub(githubToken, githubUsername, githubRepo, githubBranch, imageFile.name, base64Image, uploaderName);
        };
        reader.onerror = function() {
            showStatus('读取图片文件失败，请重试。', 'error');
            uploadButton.disabled = false;
            uploadButton.textContent = '上传图片';
        };
        reader.readAsDataURL(imageFile);
    });
    
    // 上传图片到GitHub
    function uploadToGitHub(token, username, repo, branch, filename, base64Content, uploaderName) {
        const imagePath = `images/${filename}`;
        const metaPath = `images/${filename.replace(/\.[^/.]+$/, '')}.json`;
        const imageUrl = `https://api.github.com/repos/${username}/${repo}/contents/${imagePath}`;
        const metaUrl = `https://api.github.com/repos/${username}/${repo}/contents/${metaPath}`;
        
        // 构建提交信息，包含上传者名字
        let commitMessage = `Upload image: ${filename}`;
        if (uploaderName) {
            commitMessage += ` by ${uploaderName}`;
        }
        
        // 构建图片请求体
        const imageRequestBody = {
            message: commitMessage,
            content: base64Content,
            branch: branch
        };
        
        // 构建元数据请求体
        const metaData = {
            uploader: uploaderName || '未知用户',
            filename: filename,
            uploadedAt: new Date().toISOString()
        };
        const metaBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(metaData, null, 2))));
        const metaRequestBody = {
            message: `Add metadata for ${filename}`,
            content: metaBase64,
            branch: branch
        };
        
        // 先上传图片
        fetch(imageUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageRequestBody)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || '上传图片失败');
                });
            }
            return response.json();
        })
        .then(imageData => {
            // 再上传元数据
            return fetch(metaUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metaRequestBody)
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || '上传元数据失败');
                });
            }
            return response.json();
        })
        .then(metaData => {
            // 计算GitHub Pages URL
            const githubPagesUrl = `https://${username}.github.io/${repo}/images/${filename}`;
            
            // 显示上传成功状态
            showStatus('图片上传成功！', 'success');
            
            // 显示预览和URL
            previewContainer.style.display = 'block';
            previewImage.src = githubPagesUrl;
            previewUrl.innerHTML = `图片URL: <a href="${githubPagesUrl}" target="_blank">${githubPagesUrl}</a>`;
            
            // 重置上传按钮
            uploadButton.disabled = false;
            uploadButton.textContent = '上传图片';
        })
        .catch(error => {
            showStatus(`上传失败: ${error.message}`, 'error');
            uploadButton.disabled = false;
            uploadButton.textContent = '上传图片';
        });
    }
    
    // 显示状态消息
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message status-${type}`;
        statusMessage.style.display = 'block';
    }
});
