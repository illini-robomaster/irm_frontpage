// 兵种情况数据管理
let robotTypesData = {
    robotTypes: [
        {
            id: 1,
            name: '英雄',
            icon: '🎯',
            videos: [
                {
                    id: 1,
                    title: '英雄机器人展示视频',
                    fileName: 'c6037a981b94b0a0acba55694080a612.mp4',
                    date: '2026-01-11',
                    description: '英雄机器人功能演示',
                    team: '待补充',
                    videoUrl: 'videos/c6037a981b94b0a0acba55694080a612.mp4' // 使用相对路径
                }
            ]
        }
    ]
};

// 存储文件对象的映射（不持久化）
const videoFileMap = new Map();

// 从localStorage加载数据
function loadRobotTypesData() {
    const savedData = localStorage.getItem('robotTypesData');
    if (savedData) {
        robotTypesData = JSON.parse(savedData);
    }
}

// 保存数据到localStorage
function saveRobotTypesData() {
    localStorage.setItem('robotTypesData', JSON.stringify(robotTypesData));
}

// 渲染所有兵种
function renderRobotTypes() {
    const container = document.getElementById('robotTypesContainer');
    container.innerHTML = '';
    
    robotTypesData.robotTypes.forEach(robotType => {
        const section = createRobotTypeSection(robotType);
        container.appendChild(section);
    });
}

// 创建兵种区域
function createRobotTypeSection(robotType) {
    const section = document.createElement('div');
    section.className = 'media-section';
    section.dataset.typeId = robotType.id;
    
    section.innerHTML = `
        <div class="section-header">
            <h3>${robotType.icon} ${robotType.name}机器人</h3>
            <div class="section-actions">
                <button class="delete-type-btn" onclick="deleteRobotType(${robotType.id})">删除兵种</button>
            </div>
        </div>
        
        <div class="drop-zone" 
             ondrop="handleDrop(event, ${robotType.id})" 
             ondragover="handleDragOver(event)"
             ondragleave="handleDragLeave(event)">
            <div class="drop-zone-content">
                <p class="drop-zone-icon">📹</p>
                <p class="drop-zone-text">拖拽视频文件到这里上传</p>
                <p class="drop-zone-hint">或点击选择文件</p>
                <input type="file" 
                       accept="video/*" 
                       multiple 
                       style="display: none;" 
                       id="fileInput_${robotType.id}"
                       onchange="handleFileSelect(event, ${robotType.id})">
                <button class="upload-btn" onclick="document.getElementById('fileInput_${robotType.id}').click()">
                    选择视频文件
                </button>
            </div>
        </div>
        
        <div class="media-grid" id="mediaGrid_${robotType.id}">
            ${renderVideos(robotType.videos)}
        </div>
    `;
    
    return section;
}

// 渲染视频列表
function renderVideos(videos) {
    if (!videos || videos.length === 0) {
        return '<div class="empty-state"><p>暂无展示内容</p></div>';
    }
    
    return videos.map(video => {
        // 检查是否有临时文件对象
        const fileObj = videoFileMap.get(video.id);
        const videoUrl = fileObj ? URL.createObjectURL(fileObj) : (video.videoUrl || `videos/${video.fileName}`);
        
        return `
            <div class="media-card">
                <div class="media-header">
                    <h4>${video.title}</h4>
                    <span class="media-date">展示日期：${video.date}</span>
                </div>
                <div class="video-container">
                    <video controls src="${videoUrl}">
                        您的浏览器不支持视频播放。
                    </video>
                </div>
                <div class="media-info">
                    <p><strong>展示内容：</strong>${video.description}</p>
                    <p><strong>负责团队：</strong>${video.team}</p>
                </div>
                <div class="media-actions">
                    <button class="edit-video-btn" onclick="editVideo(${video.id})">编辑</button>
                    <button class="delete-video-btn" onclick="deleteVideo(${video.id})">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

// 处理拖拽进入
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('drag-over');
}

// 处理拖拽离开
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('drag-over');
}

// 处理文件拖放
function handleDrop(event, typeId) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    processFiles(files, typeId);
}

// 处理文件选择
function handleFileSelect(event, typeId) {
    const files = event.target.files;
    processFiles(files, typeId);
}

// 处理文件
function processFiles(files, typeId) {
    const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'));
    
    if (videoFiles.length === 0) {
        alert('请选择视频文件！');
        return;
    }
    
    videoFiles.forEach(file => {
        // 存储文件对象以便后续创建Blob URL
        showAddVideoModal(typeId, file.name, file);
    });
}

// 显示添加视频的弹窗
function showAddVideoModal(typeId, fileName, fileObject = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>添加视频信息</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <form id="addVideoForm">
                    <div class="form-group">
                        <label>视频标题：</label>
                        <input type="text" id="videoTitle" required>
                    </div>
                    <div class="form-group">
                        <label>文件名：</label>
                        <input type="text" id="videoFileName" value="${fileName}" required readonly>
                    </div>
                    <div class="form-group">
                        <label>展示日期：</label>
                        <input type="date" id="videoDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label>展示内容：</label>
                        <textarea id="videoDescription" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>负责团队：</label>
                        <input type="text" id="videoTeam">
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="save-btn">保存</button>
                        <button type="button" class="cancel-btn" onclick="this.closest('.modal').remove()">取消</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('addVideoForm').onsubmit = (e) => {
        e.preventDefault();
        addVideo(typeId, fileObject);
        modal.remove();
    };
}

// 添加视频
function addVideo(typeId, fileObject = null) {
    const robotType = robotTypesData.robotTypes.find(rt => rt.id === typeId);
    if (!robotType) return;
    
    const videoId = Date.now();
    const newVideo = {
        id: videoId,
        title: document.getElementById('videoTitle').value,
        fileName: document.getElementById('videoFileName').value,
        date: document.getElementById('videoDate').value,
        description: document.getElementById('videoDescription').value || '无描述',
        team: document.getElementById('videoTeam').value || '待补充',
        isLocalFile: !!fileObject // 标记是否为本地拖拽的文件
    };
    
    // 如果有文件对象，存储到Map中
    if (fileObject) {
        videoFileMap.set(videoId, fileObject);
    }
    
    robotType.videos.push(newVideo);
    saveRobotTypesData();
    renderRobotTypes();
}

// 编辑视频
function editVideo(videoId) {
    let targetType = null;
    let targetVideo = null;
    
    for (const robotType of robotTypesData.robotTypes) {
        const video = robotType.videos.find(v => v.id === videoId);
        if (video) {
            targetType = robotType;
            targetVideo = video;
            break;
        }
    }
    
    if (!targetVideo) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>编辑视频信息</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <form id="editVideoForm">
                    <div class="form-group">
                        <label>视频标题：</label>
                        <input type="text" id="editVideoTitle" value="${targetVideo.title}" required>
                    </div>
                    <div class="form-group">
                        <label>文件名：</label>
                        <input type="text" id="editVideoFileName" value="${targetVideo.fileName}" required>
                    </div>
                    <div class="form-group">
                        <label>展示日期：</label>
                        <input type="date" id="editVideoDate" value="${targetVideo.date}" required>
                    </div>
                    <div class="form-group">
                        <label>展示内容：</label>
                        <textarea id="editVideoDescription" rows="3">${targetVideo.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>负责团队：</label>
                        <input type="text" id="editVideoTeam" value="${targetVideo.team}">
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="save-btn">保存</button>
                        <button type="button" class="cancel-btn" onclick="this.closest('.modal').remove()">取消</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('editVideoForm').onsubmit = (e) => {
        e.preventDefault();
        targetVideo.title = document.getElementById('editVideoTitle').value;
        targetVideo.fileName = document.getElementById('editVideoFileName').value;
        targetVideo.date = document.getElementById('editVideoDate').value;
        targetVideo.description = document.getElementById('editVideoDescription').value;
        targetVideo.team = document.getElementById('editVideoTeam').value;
        
        saveRobotTypesData();
        renderRobotTypes();
        modal.remove();
    };
}

// 删除视频
function deleteVideo(videoId) {
    if (!confirm('确定要删除这个视频吗？')) return;
    
    for (const robotType of robotTypesData.robotTypes) {
        const index = robotType.videos.findIndex(v => v.id === videoId);
        if (index !== -1) {
            robotType.videos.splice(index, 1);
            break;
        }
    }
    
    saveRobotTypesData();
    renderRobotTypes();
}

// 添加兵种
function showAddRobotTypeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>添加兵种</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <form id="addRobotTypeForm">
                    <div class="form-group">
                        <label>兵种名称：</label>
                        <input type="text" id="robotTypeName" placeholder="例如：英雄、步兵、工程" required>
                    </div>
                    <div class="form-group">
                        <label>图标 (emoji，可选)：</label>
                        <input type="text" id="robotTypeIcon" placeholder="例如：🎯（可不填）">
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="save-btn">添加</button>
                        <button type="button" class="cancel-btn" onclick="this.closest('.modal').remove()">取消</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('addRobotTypeForm').onsubmit = (e) => {
        e.preventDefault();
        
        const newRobotType = {
            id: Date.now(),
            name: document.getElementById('robotTypeName').value,
            icon: document.getElementById('robotTypeIcon').value,
            videos: []
        };
        
        robotTypesData.robotTypes.push(newRobotType);
        saveRobotTypesData();
        renderRobotTypes();
        modal.remove();
    };
}

// 删除兵种
function deleteRobotType(typeId) {
    if (!confirm('确定要删除这个兵种及其所有视频吗？')) return;
    
    const index = robotTypesData.robotTypes.findIndex(rt => rt.id === typeId);
    if (index !== -1) {
        robotTypesData.robotTypes.splice(index, 1);
        saveRobotTypesData();
        renderRobotTypes();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadRobotTypesData();
    renderRobotTypes();
    
    // 添加兵种按钮
    document.getElementById('addRobotTypeBtn').addEventListener('click', showAddRobotTypeModal);
});
