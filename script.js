// 图片数据
const images = [
    {
        id: 1,
        title: "风景图片1",
        description: "美丽的自然风光",
        url: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20natural%20landscape%20with%20mountains%20and%20lake&image_size=square"
    },
    {
        id: 2,
        title: "风景图片2",
        description: "壮观的山脉景色",
        url: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=majestic%20mountain%20range%20with%20snow%20capped%20peaks&image_size=square"
    },
    {
        id: 3,
        title: "风景图片3",
        description: "宁静的森林小径",
        url: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20forest%20path%20with%20sunlight%20filtering%20through%20trees&image_size=square"
    },
    {
        id: 4,
        title: "风景图片4",
        description: "美丽的海滩日落",
        url: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20beach%20sunset%20with%20orange%20sky&image_size=square"
    },
    {
        id: 5,
        title: "风景图片5",
        description: "宏伟的瀑布",
        url: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=magnificent%20waterfall%20in%20lush%20green%20forest&image_size=square"
    },
    {
        id: 6,
        title: "风景图片6",
        description: "城市天际线",
        url: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20city%20skyline%20at%20night%20with%20lights&image_size=square"
    }
];

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 渲染图片画廊
    renderGallery();
});

// 渲染图片画廊
function renderGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    // 清空容器
    galleryContainer.innerHTML = '';
    
    // 遍历图片数据，创建图片项
        images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        
        // 创建标题和描述
        const caption = document.createElement('div');
        caption.className = 'caption';
        
        const h3 = document.createElement('h3');
        h3.textContent = image.title;
        
        const p = document.createElement('p');
        p.textContent = image.description;
        
        // 组装元素
        caption.appendChild(h3);
        caption.appendChild(p);
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(caption);
        
        // 添加点击事件，跳转到分享页
        galleryItem.addEventListener('click', function() {
            const url = `share.html?id=${image.id}&title=${encodeURIComponent(image.title)}&description=${encodeURIComponent(image.description)}&url=${encodeURIComponent(image.url)}`;
            window.location.href = url;
        });
        
        // 添加到容器
        galleryContainer.appendChild(galleryItem);
    });
}
