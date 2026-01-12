// 检查登录状态
const currentUser = sessionStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'login.html';
}

// 退出登录功能
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}
