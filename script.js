// GitHub仓库信息
const githubRepoInfo = {
    owner: 'jianyuandanbaiawa',
    repo: 'cunchu',
    branch: 'main'
};

// 存储所有图片和文本数据
let allImages = [];
let allTexts = [];

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    // 渲染图片画廊
    renderGallery();
    // 渲染文本内容
    renderTexts();
    // 初始化搜索功能
    initSearch();
});

// 检查登录状态
function checkLoginStatus() {
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        const isLoggedIn = localStorage.getItem('githubLoggedIn') === 'true';
        if (isLoggedIn) {
            // 已登录状态
            loginButton.textContent = '已登录';
            loginButton.href = '#';
            loginButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('确定要登出吗？')) {
                    logout();
                }
            });
        } else {
            // 未登录状态
            loginButton.textContent = '登录';
            loginButton.href = 'login.html';
        }
    }
}

// 登出功能
function logout() {
    localStorage.removeItem('githubLoggedIn');
    localStorage.removeItem('loginTime');
    // 刷新页面
    window.location.reload();
}

// 渲染图片画廊
function renderGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    // 清空容器
    galleryContainer.innerHTML = '';
    
    // 显示加载状态
    galleryContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">加载图片中，请稍候...</div>';
    
    // 从GitHub API获取图片
    fetchImagesFromGitHub()
        .then(images => {
            // 存储图片数据
            allImages = images;
            
            // 清空容器
            galleryContainer.innerHTML = '';
            
            // 遍历图片数据，创建图片项
            images.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                // 创建图片元素
                const img = document.createElement('img');
                img.src = image.download_url;
                img.alt = image.name;
                
                // 创建标题和描述
                const caption = document.createElement('div');
                caption.className = 'caption';
                
                const h3 = document.createElement('h3');
                h3.textContent = image.name;
                
                const p = document.createElement('p');
                p.textContent = `上传者: ${image.uploaderName}`;
                
                // 组装元素
                caption.appendChild(h3);
                caption.appendChild(p);
                
                galleryItem.appendChild(img);
                galleryItem.appendChild(caption);
                
                // 添加点击事件，跳转到分享页
                galleryItem.addEventListener('click', function() {
                    const url = `share.html?id=${index + 1}&title=${encodeURIComponent(image.name)}&description=${encodeURIComponent('上传的图片')}&uploader=${encodeURIComponent(image.uploaderName)}&url=${encodeURIComponent(image.download_url)}`;
                    window.location.href = url;
                });
                
                // 添加到容器
                galleryContainer.appendChild(galleryItem);
            });
        })
        .catch(error => {
            console.error('获取图片失败:', error);
            galleryContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: red;">加载图片失败，请刷新页面重试</div>';
        });
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        // 回车键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // 输入时实时搜索
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
    }
}

// 执行搜索
function performSearch(keyword) {
    if (!keyword.trim()) {
        // 关键词为空，显示所有内容
        renderGallery();
        renderTexts();
        return;
    }
    
    const keywordLower = keyword.toLowerCase();
    
    // 过滤图片
    const filteredImages = allImages.filter(image => {
        return image.name.toLowerCase().includes(keywordLower) || 
               image.uploaderName.toLowerCase().includes(keywordLower);
    });
    
    // 过滤文本
    const filteredTexts = allTexts.filter(text => {
        return (text.title || text.name).toLowerCase().includes(keywordLower) || 
               text.uploaderName.toLowerCase().includes(keywordLower) || 
               text.content.toLowerCase().includes(keywordLower);
    });
    
    // 显示过滤后的图片
    displayFilteredImages(filteredImages);
    
    // 显示过滤后的文本
    displayFilteredTexts(filteredTexts);
}

// 显示过滤后的图片
function displayFilteredImages(images) {
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.innerHTML = '';
    
    if (images.length === 0) {
        galleryContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">没有找到匹配的图片</div>';
        return;
    }
    
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = image.download_url;
        img.alt = image.name;
        
        const caption = document.createElement('div');
        caption.className = 'caption';
        
        const h3 = document.createElement('h3');
        h3.textContent = image.name;
        
        const p = document.createElement('p');
        p.textContent = `上传者: ${image.uploaderName}`;
        
        caption.appendChild(h3);
        caption.appendChild(p);
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(caption);
        
        galleryItem.addEventListener('click', function() {
            const url = `share.html?id=${index + 1}&title=${encodeURIComponent(image.name)}&description=${encodeURIComponent('上传的图片')}&uploader=${encodeURIComponent(image.uploaderName)}&url=${encodeURIComponent(image.download_url)}`;
            window.location.href = url;
        });
        
        galleryContainer.appendChild(galleryItem);
    });
}

// 显示过滤后的文本
function displayFilteredTexts(texts) {
    const textsContainer = document.querySelector('.texts-container');
    textsContainer.innerHTML = '';
    
    if (texts.length === 0) {
        textsContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">没有找到匹配的文本</div>';
        return;
    }
    
    texts.forEach((text, index) => {
        const textItem = document.createElement('div');
        textItem.className = 'text-item';
        
        const textHeader = document.createElement('div');
        textHeader.className = 'text-header';
        
        const h3 = document.createElement('h3');
        h3.textContent = text.title || text.name;
        
        const p = document.createElement('p');
        p.textContent = `上传者: ${text.uploaderName}`;
        
        const textContent = document.createElement('div');
        textContent.className = 'text-content';
        textContent.textContent = text.content.substring(0, 200) + (text.content.length > 200 ? '...' : '');
        
        const textFooter = document.createElement('div');
        textFooter.className = 'text-footer';
        
        const a = document.createElement('a');
        a.href = `view-text.html?url=${encodeURIComponent(text.download_url)}&title=${encodeURIComponent(text.title || text.name)}&uploader=${encodeURIComponent(text.uploaderName)}`;
        a.target = '_blank';
        a.textContent = '查看全文';
        
        textHeader.appendChild(h3);
        textHeader.appendChild(p);
        textFooter.appendChild(a);
        
        textItem.appendChild(textHeader);
        textItem.appendChild(textContent);
        textItem.appendChild(textFooter);
        
        textsContainer.appendChild(textItem);
    });
}

// 初始化搜索功能
initSearch();

// 从GitHub API获取图片
function fetchImagesFromGitHub() {
    const { owner, repo, branch } = githubRepoInfo;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/images?ref=${branch}`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('获取图片列表失败');
            }
            return response.json();
        })
        .then(data => {
            // 分离图片文件和元数据文件
            const imageFiles = [];
            const metaFiles = {};
            
            data.forEach(item => {
                if (item.type === 'file') {
                    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)) {
                        // 图片文件
                        imageFiles.push(item);
                    } else if (item.name.endsWith('.json')) {
                        // 元数据文件
                        const imageName = item.name.replace('.json', '');
                        metaFiles[imageName] = item;
                    }
                }
            });
            
            // 为每个图片添加上传者信息
            return Promise.all(imageFiles.map(image => {
                const imageName = image.name.replace(/\.[^/.]+$/, '');
                const metaFile = metaFiles[imageName];
                
                if (metaFile) {
                    // 有对应的元数据文件，获取上传者信息
                    return fetch(metaFile.download_url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('获取元数据失败');
                            }
                            return response.json();
                        })
                        .then(metaData => {
                            return {
                                ...image,
                                uploaderName: metaData.uploader || '未知上传者'
                            };
                        })
                        .catch(error => {
                            console.error(`获取${image.name}的元数据失败:`, error);
                            return {
                                ...image,
                                uploaderName: '未知上传者'
                            };
                        });
                } else {
                    // 没有对应的元数据文件
                    return {
                        ...image,
                        uploaderName: '未知上传者'
                    };
                }
            }));
        });
}

// 渲染文本内容
function renderTexts() {
    const textsContainer = document.querySelector('.texts-container');
    
    // 清空容器
    textsContainer.innerHTML = '';
    
    // 显示加载状态
    textsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">加载文本中，请稍候...</div>';
    
    // 从GitHub API获取文本
    fetchTextsFromGitHub()
        .then(texts => {
            // 存储文本数据
            allTexts = texts;
            
            // 清空容器
            textsContainer.innerHTML = '';
            
            // 遍历文本数据，创建文本项
            texts.forEach((text, index) => {
                const textItem = document.createElement('div');
                textItem.className = 'text-item';
                
                // 创建文本头部
                const textHeader = document.createElement('div');
                textHeader.className = 'text-header';
                
                const h3 = document.createElement('h3');
                h3.textContent = text.title || text.name;
                
                const p = document.createElement('p');
                p.textContent = `上传者: ${text.uploaderName}`;
                
                // 创建文本内容
                const textContent = document.createElement('div');
                textContent.className = 'text-content';
                textContent.textContent = text.content.substring(0, 200) + (text.content.length > 200 ? '...' : '');
                
                // 创建文本底部
                const textFooter = document.createElement('div');
                textFooter.className = 'text-footer';
                
                const a = document.createElement('a');
                a.href = `view-text.html?url=${encodeURIComponent(text.download_url)}&title=${encodeURIComponent(text.title || text.name)}&uploader=${encodeURIComponent(text.uploaderName)}`;
                a.target = '_blank';
                a.textContent = '查看全文';
                
                // 组装元素
                textHeader.appendChild(h3);
                textHeader.appendChild(p);
                textFooter.appendChild(a);
                
                textItem.appendChild(textHeader);
                textItem.appendChild(textContent);
                textItem.appendChild(textFooter);
                
                // 添加到容器
                textsContainer.appendChild(textItem);
            });
        })
        .catch(error => {
            console.error('获取文本失败:', error);
            textsContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: red;">加载文本失败，请刷新页面重试</div>';
        });
}

// 从GitHub API获取文本
function fetchTextsFromGitHub() {
    const { owner, repo, branch } = githubRepoInfo;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/texts?ref=${branch}`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('获取文本列表失败');
            }
            return response.json();
        })
        .then(data => {
            // 分离文本文件和元数据文件
            const textFiles = [];
            const metaFiles = {};
            
            data.forEach(item => {
                if (item.type === 'file') {
                    if (item.name.endsWith('.txt')) {
                        // 文本文件
                        textFiles.push(item);
                    } else if (item.name.endsWith('.json')) {
                        // 元数据文件
                        const textName = item.name.replace('.json', '');
                        metaFiles[textName] = item;
                    }
                }
            });
            
            // 为每个文本添加上传者信息和内容
            return Promise.all(textFiles.map(text => {
                const textName = text.name.replace('.txt', '');
                const metaFile = metaFiles[textName];
                
                // 获取文本内容
                return fetch(text.download_url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('获取文本内容失败');
                        }
                        return response.text();
                    })
                    .then(content => {
                        // 构建文本对象
                        const textObj = {
                            ...text,
                            content: content,
                            uploaderName: '未知上传者',
                            title: text.name.replace('.txt', '')
                        };
                        
                        // 如果有对应的元数据文件，获取上传者信息
                        if (metaFile) {
                            return fetch(metaFile.download_url)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('获取元数据失败');
                                    }
                                    return response.json();
                                })
                                .then(metaData => {
                                    textObj.uploaderName = metaData.uploader || '未知上传者';
                                    textObj.title = metaData.title || textObj.title;
                                    return textObj;
                                })
                                .catch(error => {
                                    console.error(`获取${text.name}的元数据失败:`, error);
                                    return textObj;
                                });
                        } else {
                            return textObj;
                        }
                    })
                    .catch(error => {
                        console.error(`获取${text.name}的内容失败:`, error);
                        return {
                            ...text,
                            content: '获取内容失败',
                            uploaderName: '未知上传者',
                            title: text.name.replace('.txt', '')
                        };
                    });
            }));
        });
}
