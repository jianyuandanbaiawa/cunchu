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
    
    // 多层加密工具函数（至少三层加密）
    function encryptToken(token) {
        try {
            // 第一层：Base64编码
            let encrypted = btoa(token);
            // 第二层：字符反转
            encrypted = encrypted.split('').reverse().join('');
            // 第三层：再次Base64编码
            encrypted = btoa(encrypted);
            return encrypted;
        } catch (e) {
            console.error('令牌加密失败:', e);
            throw e;
        }
    }
    
    // 多层解密工具函数（对应加密的逆过程）
    function decryptToken(encryptedToken) {
        try {
            // 第一层：Base64解码
            let decrypted = atob(encryptedToken);
            // 第二层：字符反转
            decrypted = decrypted.split('').reverse().join('');
            // 第三层：Base64解码
            decrypted = atob(decrypted);
            return decrypted;
        } catch (e) {
            console.error('令牌解密失败:', e);
            throw e;
        }
    }
    
    // 兼容旧的Base64解密工具函数
    function base64Decode(encodedString) {
        try {
            return atob(encodedString);
        } catch (e) {
            console.error('Base64解密失败:', e);
            throw e;
        }
    }
    
    // 兼容旧的Base64加密工具函数
    function base64Encode(string) {
        try {
            return btoa(string);
        } catch (e) {
            console.error('Base64加密失败:', e);
            throw e;
        }
    }
    
    // 从环境变量或本地存储获取Token
    function getGithubToken() {
        // 首先尝试从环境变量获取（适用于部署环境）
        if (typeof process !== 'undefined' && process.env && process.env.GITHUB_TOKEN) {
            return process.env.GITHUB_TOKEN;
        }
        // 然后尝试从localStorage获取（适用于浏览器环境，已加密）
        if (typeof localStorage !== 'undefined') {
            const encryptedToken = localStorage.getItem('github_token_encrypted');
            if (encryptedToken) {
                try {
                    // 使用多层解密工具函数解密
                    return decryptToken(encryptedToken);
                } catch (e) {
                    console.error('解密Token失败:', e);
                }
            }
        }
        // 最后从表单获取
        return document.getElementById('github-token').value;
    }
    
    // 保存Token到本地存储（加密）
    function saveGithubToken(token) {
        if (typeof localStorage !== 'undefined' && token) {
            try {
                // 使用多层加密工具函数加密
                const encryptedToken = encryptToken(token);
                localStorage.setItem('github_token_encrypted', encryptedToken);
            } catch (e) {
                console.error('加密Token失败:', e);
            }
        }
    }
    
    // 监听经典仓库按钮点击事件
    const classicRepoBtn = document.getElementById('classic-repo-btn');
    const customRepoBtn = document.getElementById('custom-repo-btn');
    
    // 确保按钮存在
    if (classicRepoBtn && customRepoBtn) {
        // 为经典仓库按钮添加点击事件
        classicRepoBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 切换按钮样式
            classicRepoBtn.classList.remove('btn-secondary');
            classicRepoBtn.classList.add('btn-primary');
            customRepoBtn.classList.remove('btn-primary');
            customRepoBtn.classList.add('btn-secondary');
            
            // 隐藏GitHub配置区域
            const githubConfig = document.getElementById('github-config');
            if (githubConfig) {
                githubConfig.style.display = 'none';
            }
            
            // 从localStorage获取保存的令牌
            const savedToken = getGithubToken();
            if (!savedToken) {
                // 如果没有保存的令牌，使用默认令牌（仅首次使用）
                const defaultToken = 'PT1nU3hKRFVIRlRaMmxtU0h4MlNxaFZXUlpHZE4xV09TZGtRc0ptZWhwblcwVUhlamgxWHdoMlo='; // 加密后的令牌
                try {
                    const token = decryptToken(defaultToken);
                    document.getElementById('github-token').value = token;
                    saveGithubToken(token);
                } catch (e) {
                    console.error('解析默认令牌失败:', e);
                    showStatus('令牌初始化失败，请使用自己的仓库配置', 'error');
                    return;
                }
            } else {
                document.getElementById('github-token').value = savedToken;
            }
            
            // 设置经典仓库配置
            document.getElementById('github-username').value = 'jianyuandanbaiawa';
            document.getElementById('github-repo').value = 'cunchu';
            document.getElementById('github-branch').value = 'main';
            
            // 检查是否选择了图片
            const imageFile = document.getElementById('image-file').files[0];
            if (!imageFile) {
                showStatus('请先选择要上传的图片', 'error');
                return;
            }
            
            // 触发表单提交
            uploadForm.dispatchEvent(new Event('submit'));
        });
    }
    
    // 监听使用自己的仓库按钮点击事件
    if (customRepoBtn) {
        customRepoBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 切换按钮样式
            customRepoBtn.classList.remove('btn-secondary');
            customRepoBtn.classList.add('btn-primary');
            classicRepoBtn.classList.remove('btn-primary');
            classicRepoBtn.classList.add('btn-secondary');
            
            // 显示GitHub配置区域
            const githubConfig = document.getElementById('github-config');
            if (githubConfig) {
                githubConfig.style.display = 'block';
            }
            
            // 清空GitHub配置输入框
            document.getElementById('github-token').value = '';
            document.getElementById('github-username').value = '';
            document.getElementById('github-repo').value = '';
            document.getElementById('github-branch').value = '';
        });
    }
    
    // 监听表单提交事件
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 检查是否选择了图片
        const imageFile = document.getElementById('image-file').files[0];
        if (!imageFile) {
            showStatus('请先选择要上传的图片', 'error');
            return;
        }
        
        // 检查GitHub配置区域是否隐藏
        const githubConfig = document.getElementById('github-config');
        const isClassicRepo = githubConfig && githubConfig.style.display === 'none';
        
        // 获取表单数据
        let githubToken = document.getElementById('github-token').value;
        let githubUsername = document.getElementById('github-username').value;
        let githubRepo = document.getElementById('github-repo').value;
        const githubBranch = document.getElementById('github-branch').value || 'main';
        const uploaderName = document.getElementById('uploader-name').value;
        
        // 如果是经典仓库模式，自动填充配置
        if (isClassicRepo) {
            // 从localStorage获取保存的令牌
            const savedToken = getGithubToken();
            if (!savedToken) {
                // 如果没有保存的令牌，使用默认令牌（仅首次使用）
                const defaultToken = 'PT1nU3hKRFVIRlRaMmxtU0h4MlNxaFZXUlpHZE4xV09TZGtRc0ptZWhwblcwVUhlamgxWHdoMlo='; // 加密后的令牌
                try {
                    githubToken = decryptToken(defaultToken);
                    document.getElementById('github-token').value = githubToken;
                    saveGithubToken(githubToken);
                } catch (e) {
                    console.error('解析默认令牌失败:', e);
                    showStatus('令牌初始化失败，请使用自己的仓库配置', 'error');
                    return;
                }
            } else {
                githubToken = savedToken;
                document.getElementById('github-token').value = savedToken;
            }
            
            // 设置经典仓库配置
            githubUsername = 'jianyuandanbaiawa';
            githubRepo = 'cunchu';
            document.getElementById('github-username').value = githubUsername;
            document.getElementById('github-repo').value = githubRepo;
            document.getElementById('github-branch').value = 'main';
        }
        
        // 验证GitHub配置
        if (!githubToken || !githubUsername || !githubRepo) {
            showStatus('请填写完整的GitHub配置信息', 'error');
            return;
        }
        
        // 保存Token到本地存储（加密）
        saveGithubToken(githubToken);
        
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
        const metaBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(metaData, null, 2))))
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