// 机器人图标映射
const robotIcons = {
    '英雄': '🎯',
    '步兵': '⚔️',
    '平衡步兵': '⚖️',
    '工程': '🔧',
    '无人机': '✈️',
    '哨兵': '🛡️',
    '雷达': '📡',
    '雷达站': '📡',
    '飞镖': '🎯',
    '烧饼': '🔥',
    '烧饼 新': '🔥'
};

// 编辑模式状态
let isEditMode = false;

// 从localStorage加载数据或使用默认数据
function loadRobotData() {
    let data;
    const savedData = localStorage.getItem('robotStatusData');
    if (savedData) {
        data = JSON.parse(savedData);
    } else {
        data = JSON.parse(JSON.stringify(robotStatusData));
    }
    
    // 确保所有机器人都有类型字段
    for (const school in data) {
        data[school].forEach(robot => {
            if (!robot['类型']) {
                // 根据是否有"计划新造"来判断
                const hasPlanned = robot['计划新造'] && robot['计划新造'] !== '无' && robot['计划新造'].trim() !== '';
                // 有计划新造的归为新造，其他为库存
                robot['类型'] = hasPlanned ? '新造' : '库存';
            }
        });
    }
    
    return data;
}

// 保存数据到localStorage
function saveRobotData(data) {
    localStorage.setItem('robotStatusData', JSON.stringify(data));
}

// 获取当前数据
function getCurrentData() {
    return loadRobotData();
}

// 根据状态确定badge样式
function getStatusBadge(robot) {
    const status = robot['状态'] || '进行中'; // 默认为进行中
    
    const statusMap = {
        '完成度高': 'status-success',
        '进行中': 'status-progress',
        '规划中': 'status-warning',
        '未开始': 'status-danger'
    };
    
    const className = statusMap[robot['状态']] || 'status-progress';
    const displayText = robot['状态'] || '进行中';
    
    return `<span class="status-badge ${className}">${displayText}</span>`;
}

// 创建单个卡片
function createRobotCard(school, robot, robotIndex = 0) {
    const icon = robotIcons[robot['兵种']] || '🤖';
    const statusText = robot['状态'] || getDefaultStatus(robot);
    const statusClass = getStatusClass(statusText);
    const robotType = robot['类型'] || '库存';
    
    // 构建note显示内容
    let noteHtml = '';
    if (robot['note'] && robot['note'].trim() !== '') {
        const notes = robot['note'].split('\n').filter(n => n.trim() !== '');
        noteHtml = notes.map(note => `<p class="robot-note">• ${note}</p>`).join('');
    }
    
    // 构建卡片
    const card = document.createElement('div');
    card.className = 'robot-card';
    card.dataset.school = school;
    card.dataset.robotIndex = robotIndex;
    card.dataset.type = robotType;
    
    card.innerHTML = `
        <div class="robot-card-header">
            <h3>${icon} ${robot['兵种']}</h3>
            <span class="robot-school">${school}</span>
        </div>
        <div class="robot-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <span class="type-badge ${robotType === '新造' ? 'type-new' : 'type-stock'}">${robotType}</span>
        </div>
        <div class="robot-info">
            <p><strong>责任人：</strong>${robot['责任人']}</p>
            <p><strong>超电状态：</strong>${robot['超电']}</p>
            <p><strong>自瞄状态：</strong>${robot['自瞄']}</p>
            ${robot['已有数量'] && robot['已有数量'] !== '无' && robot['已有数量'].trim() !== '' 
                ? `<p><strong>已有数量：</strong>${robot['已有数量']}</p>` 
                : ''}
            ${robot['计划新造'] && robot['计划新造'] !== '无' && robot['计划新造'].trim() !== '' 
                ? `<p><strong>计划新造：</strong>${robot['计划新造']}</p>` 
                : ''}
            ${robot['中期视频'] !== '未确定' && robot['中期视频'].trim() !== '' 
                ? `<p><strong>中期视频：</strong>${robot['中期视频']}</p>` 
                : ''}
        </div>
        ${noteHtml ? `<div class="robot-notes">${noteHtml}</div>` : ''}
        <div class="card-actions" style="display: none;">
            <button class="edit-card-btn" onclick="editRobot('${school}', ${robotIndex})">编辑</button>
            <button class="delete-card-btn" onclick="deleteRobot('${school}', ${robotIndex})">删除</button>
        </div>
    `;
    
    return card;
}

// 根据机器人信息获取默认状态
function getDefaultStatus(robot) {
    if (robot['超电'].includes('上场超电') && robot['自瞄'].includes('上场自瞄')) {
        return '完成度高';
    } else if (robot['超电'].includes('上场超电') || robot['自瞄'].includes('自瞄')) {
        return '进行中';
    } else if (robot['计划新造'] !== '无' && robot['计划新造'].trim() !== '') {
        return '规划中';
    } else if (robot['已有数量'] === '无' || robot['已有数量'].trim() === '') {
        return '未开始';
    } else {
        return '进行中';
    }
}

// 根据状态文本获取CSS类
function getStatusClass(statusText) {
    switch(statusText) {
        case '完成度高':
            return 'status-success';
        case '进行中':
            return 'status-progress';
        case '规划中':
            return 'status-warning';
        case '未开始':
            return 'status-danger';
        default:
            return 'status-progress';
    }
}
// 统计兵种数量
function updateRobotStats() {
    const data = getCurrentData();
    const stats = {};
    let newCount = 0;
    let stockCount = 0;
    
    for (const [school, robots] of Object.entries(data)) {
        robots.forEach(robot => {
            const type = robot['兵种'];
            stats[type] = (stats[type] || 0) + 1;
            
            // 统计新造和库存数量
            if (robot['类型'] === '新造') {
                newCount++;
            } else {
                stockCount++;
            }
        });
    }
    
    const statsContainer = document.getElementById('robotStats');
    const statsHtml = Object.entries(stats)
        .map(([type, count]) => `${robotIcons[type] || '🤖'}${type}: ${count}`)
        .join(' | ');
    statsContainer.innerHTML = statsHtml;
    
    // 更新区域计数
    document.getElementById('newRobotCount').textContent = newCount;
    document.getElementById('stockRobotCount').textContent = stockCount;
}

// 渲染机器人卡片
function renderRobotCards() {
    const newContainer = document.getElementById('newRobotsGrid');
    const stockContainer = document.getElementById('stockRobotsGrid');
    newContainer.innerHTML = '';
    stockContainer.innerHTML = '';
    
    const data = getCurrentData();
    
    // 遍历所有学校
    for (const [school, robots] of Object.entries(data)) {
        robots.forEach((robot, idx) => {
            const card = createRobotCard(school, robot, idx);
            
            // 根据类型添加到不同的容器
            if (robot['类型'] === '新造') {
                newContainer.appendChild(card);
            } else {
                stockContainer.appendChild(card);
            }
        });
    }
    
    updateRobotStats();
    updateEditModeUI();
}

// 切换编辑模式
function toggleEditMode() {
    isEditMode = !isEditMode;
    const btn = document.getElementById('editModeBtn');
    btn.textContent = isEditMode ? '退出编辑模式' : '进入编辑模式';
    btn.classList.toggle('active', isEditMode);
    updateEditModeUI();
}

// 更新编辑模式UI
function updateEditModeUI() {
    const actions = document.querySelectorAll('.card-actions');
    actions.forEach(action => {
        action.style.display = isEditMode ? 'flex' : 'none';
    });
    
    const cards = document.querySelectorAll('.robot-card');
    cards.forEach(card => {
        if (isEditMode) {
            card.classList.add('edit-mode');
        } else {
            card.classList.remove('edit-mode');
        }
    });
}

// 编辑机器人
function editRobot(school, robotIndex) {
    const data = getCurrentData();
    const robot = data[school][robotIndex];
    
    showEditModal(school, robotIndex, robot);
}

// 删除机器人
function deleteRobot(school, robotIndex) {
    if (!confirm('确定要删除这个兵种吗？')) return;
    
    const data = getCurrentData();
    data[school].splice(robotIndex, 1);
    
    // 如果学校没有机器人了，删除学校
    if (data[school].length === 0) {
        delete data[school];
    }
    
    saveRobotData(data);
    renderRobotCards();
}

// 显示编辑弹窗
function showEditModal(school, robotIndex, robot) {
    const isNew = robotIndex === -1;
    const schools = Object.keys(getCurrentData());
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${isNew ? '新增兵种' : '编辑兵种'}</h3>
            <form id="editForm">
                <div class="form-group">
                    <label>学校：</label>
                    <select id="schoolSelect" ${isNew ? '' : 'disabled'}>
                        ${schools.map(s => `<option value="${s}" ${s === school ? 'selected' : ''}>${s}</option>`).join('')}
                        <option value="_new_">+ 新学校</option>
                    </select>
                    <input type="text" id="newSchoolInput" placeholder="输入新学校名" style="display: none; margin-top: 5px;">
                </div>
                <div class="form-group">
                    <label>类型：</label>
                    <select id="robotCategory">
                        <option value="新造" ${robot && robot['类型'] === '新造' ? 'selected' : ''}>🔨 新造</option>
                        <option value="库存" ${robot && robot['类型'] === '库存' ? 'selected' : ''}>📦 库存</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>兵种：</label>
                    <input type="text" id="robotType" value="${robot ? robot['兵种'] : ''}" required>
                </div>
                <div class="form-group">
                    <label>状态：</label>
                    <select id="robotStatus">
                        <option value="完成度高" ${robot && robot['状态'] === '完成度高' ? 'selected' : ''}>✅ 完成度高</option>
                        <option value="进行中" ${robot && robot['状态'] === '进行中' ? 'selected' : ''}>🔵 进行中</option>
                        <option value="规划中" ${robot && robot['状态'] === '规划中' ? 'selected' : ''}>📋 规划中</option>
                        <option value="未开始" ${robot && robot['状态'] === '未开始' ? 'selected' : ''}>⚠️ 未开始</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>超电状态：</label>
                    <select id="superCapacitor">
                        <option value="上场超电" ${robot && robot['超电'] === '上场超电' ? 'selected' : ''}>上场超电</option>
                        <option value="无超电" ${robot && robot['超电'] === '无超电' ? 'selected' : ''}>无超电</option>
                        <option value="正在研发" ${robot && robot['超电'] === '正在研发' ? 'selected' : ''}>正在研发</option>
                        <option value="无" ${robot && robot['超电'] === '无' ? 'selected' : ''}>无</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>自瞄状态：</label>
                    <select id="autoAim">
                        <option value="上场自瞄" ${robot && robot['自瞄'] === '上场自瞄' ? 'selected' : ''}>上场自瞄</option>
                        <option value="有自瞄" ${robot && robot['自瞄'] === '有自瞄' ? 'selected' : ''}>有自瞄</option>
                        <option value="正在研发" ${robot && robot['自瞄'] === '正在研发' ? 'selected' : ''}>正在研发</option>
                        <option value="无" ${robot && robot['自瞄'] === '无' ? 'selected' : ''}>无</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>已有数量：</label>
                    <input type="text" id="existing" value="${robot ? robot['已有数量'] : ''}">
                </div>
                <div class="form-group">
                    <label>计划新造：</label>
                    <input type="text" id="planned" value="${robot ? robot['计划新造'] : ''}">
                </div>
                <div class="form-group">
                    <label>责任人：</label>
                    <input type="text" id="responsible" value="${robot ? robot['责任人'] : ''}">
                </div>
                <div class="form-group">
                    <label>中期视频：</label>
                    <input type="text" id="midterm" value="${robot ? robot['中期视频'] : ''}">
                </div>
                <div class="form-group">
                    <label>备注（每行一条）：</label>
                    <textarea id="notes" rows="4">${robot ? robot['note'] : ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">保存</button>
                    <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 学校选择逻辑
    const schoolSelect = document.getElementById('schoolSelect');
    const newSchoolInput = document.getElementById('newSchoolInput');
    schoolSelect.addEventListener('change', (e) => {
        newSchoolInput.style.display = e.target.value === '_new_' ? 'block' : 'none';
    });
    
    // 表单提交
    document.getElementById('editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        let targetSchool = schoolSelect.value;
        if (targetSchool === '_new_') {
            targetSchool = newSchoolInput.value.trim();
            if (!targetSchool) {
                alert('请输入学校名');
                return;
            }
        }
        
        const updatedRobot = {
            '兵种': document.getElementById('robotType').value,
            '类型': document.getElementById('robotCategory').value,
            '状态': document.getElementById('robotStatus').value,
            '超电': document.getElementById('superCapacitor').value,
            '自瞄': document.getElementById('autoAim').value,
            '已有数量': document.getElementById('existing').value,
            '计划新造': document.getElementById('planned').value,
            '责任人': document.getElementById('responsible').value,
            '中期视频': document.getElementById('midterm').value,
            'note': document.getElementById('notes').value
        };
        
        const data = getCurrentData();
        
        if (isNew) {
            // 新增
            if (!data[targetSchool]) {
                data[targetSchool] = [];
            }
            data[targetSchool].push(updatedRobot);
        } else {
            // 更新
            data[school][robotIndex] = updatedRobot;
        }
        
        saveRobotData(data);
        closeModal();
        renderRobotCards();
    });
    
    // 点击外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// 关闭弹窗
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// 新增机器人
function addRobot() {
    showEditModal('', -1, null);
}

// 页面加载时渲染
document.addEventListener('DOMContentLoaded', () => {
    renderRobotCards();
    
    // 绑定按钮事件
    document.getElementById('editModeBtn').addEventListener('click', toggleEditMode);
    document.getElementById('addRobotBtn').addEventListener('click', addRobot);
});

// 全局函数供onclick使用
window.editRobot = editRobot;
window.deleteRobot = deleteRobot;
window.closeModal = closeModal;
