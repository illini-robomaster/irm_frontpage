// 用户数据库 - 中文名作为用户名，英文名作为密码
// 数据来源：2026赛季五大湖联队参赛人员名单收集（收集结果）.xlsx
const users = {
    '李正瀚': 'zhenghanli',
    '张乂凡': 'yifanzhang',
    '孟庭宇': 'tingyumeng',
    '李雨彤': 'tori',
    '黄霄铭': 'xiaominghuang',
    '苏之恒': 'zhihengsu',
    '徐致谦': 'jasonxu',
    '彭越': 'yuepeng',
    '徐达文': 'dawenxu',
    '胡歆悦': 'xinyuehu',
    '夏澜柯': 'tonyxia',
    '赵涌哲': 'colinzhao',
    '周陆子健': 'jameszhou',
    '王子涵': 'dannywang',
    '田亦晨': 'yichentian',
    '高雨飞': 'leithgao',
    '许成易': 'ethanxu',
    '薛立伟': 'liweixue',
    '吴天然': 'rosewu',
    '杨一弘': 'yihongyang',
    '苏晋可': 'anthonysu',
    '汪岳林': 'wesleywang',
    '伍安楠': 'annanwu',
    '于海宸': 'dawson',
    '沈子皓': 'victorshen',
    '蔡卓远': 'danielzhuoyuancai',
    '徐子杰': 'richardzijiexu',
    '李拜六': 'bailiuli',
    '王子逸': 'ziyiwang',
    '郭明昊': 'benguo',
    '袁泽昊': 'zehaoyuan',
    '刘宗原': 'joeyliu',
    '陈宝泽': 'chansonchen',
    '潘耀权': 'yaoquanpan',
    '吴标锐': 'biaoruiwu',
    '朱保利': 'poli',
    '黄镇东': 'donhuang',
    '成盛杰': 'shengjiecheng',
    '蔡伟昊': 'caiweihao',
    '涂光悦': 'guangyuetu',
};

// 检查是否已登录
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    } else if (!currentUser && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'login.html';
    }
}

// 页面加载时检查登录状态
window.addEventListener('DOMContentLoaded', checkAuth);

// 登录表单处理
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorMessage = document.getElementById('error-message');
        
        // 验证用户名和密码
        if (users[username] && users[username].toLowerCase() === password.toLowerCase()) {
            // 登录成功
            sessionStorage.setItem('currentUser', username);
            window.location.href = 'dashboard.html';
        } else {
            // 登录失败
            errorMessage.textContent = '用户名或密码错误，请重试';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').focus();
        }
    });
}
