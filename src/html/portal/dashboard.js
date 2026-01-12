// 检查登录状态
const currentUser = sessionStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'login.html';
}

// 显示用户名
const userNameElement = document.getElementById('userName');
if (userNameElement) {
    userNameElement.textContent = currentUser;
}

// 退出登录
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}

// 中期文档提交截止时间：2026年1月29日 15:00 (北京时间 UTC+8)
const deadline = new Date('2026-01-29T15:00:00+08:00');

function updateCountdown() {
    const now = new Date();
    const timeLeft = deadline - now;
    
    const deadlineStatus = document.getElementById('deadline-status');
    
    if (timeLeft <= 0) {
        // 截止时间已过
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        
        deadlineStatus.textContent = '截止时间已过';
        deadlineStatus.className = 'deadline-status expired';
        return;
    }
    
    // 计算剩余时间
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // 更新显示
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // 更新状态信息
    if (days === 0 && hours < 24) {
        deadlineStatus.textContent = '⚠️ 即将截止！请抓紧时间！';
        deadlineStatus.className = 'deadline-status expired';
    } else {
        deadlineStatus.textContent = '✓ 还有充足时间';
        deadlineStatus.className = 'deadline-status active';
    }
}

// 初始化倒计时
updateCountdown();

// 每秒更新一次
setInterval(updateCountdown, 1000);
