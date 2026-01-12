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

// 会议纪要内容（从Word文档提取）
const meetingMinutesContent = `
9/20 会议大纲
1. 赛季目标：顺利完成赛季相关工作，并具备参赛条件，确保能够参加比赛。
2.细分目标：赛季规划—>中期考核—>完整形态 
3. 当前识别的重点风险项目为：无人机与哨兵。需在后续工作中制定详细的专项安排与风险应对措施。
4. 请在下次例会前，在"2026"共享文档中，"是否同意拍摄中期视频"列中填写"中期"的各个兵种（共13个），提交中期考核前（今-2026.3）赛季规划，见模版。
开题前两周一次例会，开题后一周一次；提交相关汇报材料（包括照片、视频等），并于会前统一报
9/25 会议大纲：
1. 明确各队伍RMUC区域赛参赛可能性，列出放假时间，UIUC：5.15， VT：5.13， MacMaster: , UBC:4.25,  ,GDIP:6.24   
（南部赛区5.13-17；中部赛区5.21-25； 东部赛区5.29-6.02）
涉及到的问题：
（a）在假设ARC与2024 RMNA举办时间相同，为6月末，故需要5月末携机器人从北美飞往中国，参加完区域赛后再从中国飞往北美。时间成本，经济成本，队员是否同意。并且考虑极端情况我们进入了复活赛或者国赛，还需要再次将机器人运送回中国
（b）如果参加国内分区赛，如南部分区赛，中期考核，完整形态是否与国内队伍一起评选。所涉及到的问题
3 申请提议书需发群里，进行二次改进： 
RoboMaster组委会，
您好，我是五大湖联合大学 2026 赛季队长刘宗原。谨代表五大湖联合大学全体队员，就 2026 赛季赛事设置向组委会提出以下建议与疑问：
一、关于区域赛时间安排
 五大湖联合大学为跨国联队，成员主要来自美国与加拿大高校。加拿大高校的学期通常于四月底结束，而美国高校的学期则多在五月中旬结束。若 2026 赛季最后一场区域赛的时间仍与 2025 赛季一致，则我队将面临无法参赛的困境。
 为此，恳请组委会考虑将最后一场区域赛时间调整至 6 月中旬或下旬，并尽量避免与 RMNA（现已更名为 ARC）的赛程冲突，以便国际赛区有充足时间将机器人从北美运输回国内参赛。
二、关于联队参赛资格的疑问
目前，五大湖联合大学战队包括：伊利诺伊大学香槟分校（美国）、弗吉尼亚理工大学（美国）、不列颠哥伦比亚大学（加拿大）、麦克马斯特大学（加拿大）、广东轻工职业技术大学（中国）。五大湖联合大学系为参加 RMUC 而成立的联队，并在参加北美 RMNA 或国内 RMUL 时，均以各自学校名义独立参赛。
我们希望确认：五大湖联合大学在 2024 RMUC 的参赛经历，是否足以保证其在 2026 赛季继续保有报名资格。
此外，对于未来的参赛资格，我们亦有诸多疑问。我们注意到，今年的参赛资格规定中明确包括："在 RMUL 2025 的 3V3 对抗赛小组赛中成功晋级的队伍（若小组赛有两轮，以第一轮晋级为准）。"对此，我们想进一步确认：
若联队中的某一所学校以该校名义参加国内RMUL，并成功在小组赛中晋级，是否可视为整个五大湖联合大学具备参赛资格？
若海外版 RMUL（即 ARC）队伍在小组赛中成功晋级，是否同样可以获得参赛资格？
若上述情形均不被认可，是否意味着五大湖联合大学必须以联队名义在 RMUL 正式参赛并取得小组赛晋级，方可取得后续RMUC赛季的参赛资格？
三、关于国际赛区的保留问题
 我们希望了解取消国际赛区的初衷和意义。正如六支国际及港澳台赛区队伍在 2025 赛季提交的联合声明中所强调的，海外队伍长期面临着物流、资金、时间及人员方面的巨大压力，这些困难的程度是国内队伍所不可能面临的。
 尽管如此，我们一直积极正视与国内队伍的差距，并在近两年投入大量资源发展制导飞镖、无人机等兵种，期望通过参赛不断提升队伍整体水平。若国际赛区被直接取消，只会进一步抑制海外队伍的发展空间，不利于赛事的全球化与多样化。综上，恳请组委会慎重考虑国际队伍的实际情况，并在赛事安排中为我们保留合理的发展机会。
此致
敬礼
五大湖联合大学 2026 赛季队长
刘宗原
是否考虑参加RMUL国内区赛，时间: 寒假，做为中期评选或完整形态考核没过的备选。保证2027赛季的参赛资格。是否其中一个队伍通过3V3便可以以联队形式参赛。是否有UL时间可选，广轻工是否可以代表参赛。
聊群问题，组委会
10/25 会议大纲：
1. 各队伍赛季规划完成情况：目前仅有 UBC， 广轻工已完成赛季规划，NYUSH、VT、UIUC 尚未完成，请尽快落实并提交。
2. 请各队伍提交一份 骨干队员名单，并填写至 2026 赛季共享文档中（EXCEL）。骨干名单需包含各兵种负责人及队伍管理层成员，以便后续统筹管理。同时提交梯队队员名单，拟定将于下周提交参赛名单。
3. 目前 26 赛季联队群 内存在较多无关人员（如 UWM、往届队员及其他无关成员）。为提高沟通效率，请依据第 2 条提交的骨干名单建立新联队群，并严禁私自拉人入群。
4. 后续所有通知与信息将仅在新群发布，其他群组（如"26 联队"、"26 联队开会群"）将全部解散。
5. 为避免信息不对称造成沟通不便，今后会议将对所有队员开放参与，但第一阶段的汇报环节由各队队长统一汇报，以缩短会议时长；后续阶段 则作为各队间的交流与讨论环节。
6. 按照9/20日会议的约定内容，自此次会议起，组会更改为一周一次。时间为每周美东时间周六晚十点，北京时间周日早十点召开。
7. 下周组会，各个学校各个兵种负责人参加会议，讨论技术方案（尤其是工程和雷达）
8. 将NYUSH机器人列入机器人规划表格，需陈述现存机器人详细信息以及后续机器人研发计划。
9. 将启动赛季规划撰写，以各队伍的赛季时间安排为基准，详情见下次例会
10. 自由讨论：赛季安排，规则出台后相应规划，各兵种目标
11/1 会议大纲：
1. 赛季报名截至北京时间11.6日，队伍名称，队伍口号，选取MacMaster,UIUC作为代表参赛队伍，其余学校人员平均至两所学校。 
2. 各队伍赛季规划完成情况：目前 UBC， 广轻工，NYUSH，UIUC已完成赛季规划，VT完成一级规划，MacMaster 尚未完成，请尽快落实并提交。赛季规划项管将进行修改，并作为正式版本赛季规划的基础时间线
3. 各队须按要求提交参赛人员名单，内容包括：所属学校、在校时间、专业、队内职责及方向等信息。参赛人员数量上限为：正式队员最多 35 人，梯队队员最多 20 人。
4. 正式队员名单应依据《2026 赛季规划文档》中表 4 "骨干人员名单"填写。现阶段由各队队长同步收集梯队队员名单。
5. 将向各队队长发送参赛人员名单示例表格。请各队队长按示例格式统计并填写正式队员 + 梯队队员名单及相关信息，并于本周一前完成提交。
6. 赛季规划将于下周提供模板，队长和项管将主要完成团队目标，团队管理、项目分析等。各个队伍的参赛队员将主要完成进度安排
11/8 会议大纲
1. 因北美调整为冬令时，会议时间修改为每周六美东时间晚十点，北京时间周日中午11点
2. 开始撰写赛季规划：
3. 赛季报名时名单规划已发送给各队队长,正式队员34人，梯队队员6人。
4. 根据最新赛季安排，学校对应关系调整如下：NYUSH、VT 调整至 MacMaster；UBC、广轻工 调整至 UIUC。相应命名规则将进行如下更改：MacMaster → MacMaster1；NYUSH → MacMaster2；VT→MacMaster3;UIUC → UIUC1； UBC → UIUC2；广轻工 → UIUC3。请各参赛队伍在后续提交的所有文档及视频中，严格按照上述命名方式进行统一修改与标注。
5. 赛季规划11.27日截至，采用word+onedrive:五大湖联合大学2026赛季规划.docx(密码：2026)
11/15 会议大纲
1. 赛季规划11.27日截至，采用word+onedrive:五大湖联合大学2026赛季规划.docx(密码：2026)
2. 赛季规划2026赛季官方规则公布
3. 赛季规划需于下周会议（11 月 22 日）前完成第一版；在随后 5 天内根据反馈完成相应修改。
4. 建立问责机制：由各学校分别列出本校各兵种的负责人，以明确职责分工与责任落实。
5. 轻流规则答疑以五大湖联合大学作为RMUC的答疑学校名称，防止其他学校透露参赛信息
6. 根据多方渠道的保守估计，整体RMUC参赛规模约在 155–160 支队伍之间。其中，能够顺利通过"完整形态考核"的队伍数量为固定的 96 支，意味着需要在中期考核与完整形态阶段淘汰约 60 支队伍。
11/22 会议大纲
1. 赛季规划未完成部分1.3 Key Technical BreakThrough(李拜六+苏竟可)，1.4Actions for process tracking（刘宗原），2.2Root Cause Analysis(刘宗原)，3.1 Interpretation of the New Season Rules(杨一弘)，3.2.1 General technical reserve（李正翰）3.3.2 Technical reserves for specific robot types(李正翰），4. Resource Feasibility Analysis（高雨飞），5.1 Personnel succession development（刘宗原），5.3 Analysis of Technical Legacy（刘宗原），6. Culture development（黄郑东），
2. 若有需要插入图像，在图像后面加"Figure 图像描述"。所有表格替换为统一模板，模板标题Times N2025ew Roman 12号加粗，标题背景为灰色，内容居中。
3. 在编写完成后删除模板内容
12/22 会议大纲
1. 赛季规划已通过
2. 测评规则详见：https://bbs.robomaster.com/wiki/20204847/812042?source=7 。
3. 测评时间为 北京时间 2025 年 12 月 24 日 18:00 至 2025 年 12 月 25 日 18:00（下周），对应 美东时间 2025 年 12 月 24 日 05:00 至 12 月 25 日 05:00（EST）。
4. 我将于 美东时间 12 月 24 日晚 10:00 开放 Zoom 会议室，请大家积极参与。本次测评需要提交 6 份成绩不低于 96 分的有效答卷。
5. 请各兵种负责人汇报进度以及情况
1/3 会议大纲
1. 讨论与UW/普渡/诺丁汉开展线上交流的相关事宜。
2. 五大湖联合大学已通过规则测评，且该阶段测评未对队伍进行筛选。
3. 中期文档提交时间为 2026 年 1 月 28 日至 2026 年 1 月 29 日。**注意：**中期文档阶段未设定明确的队伍筛选数量要求；仅在完整形态阶段，对通过队伍数量有明确要求，为 96 支队伍。
4. 2025 年中期阶段共通过内地赛区队伍 110 支，港澳台赛区队伍 4 支，分别来自香港大学、香港科技大学、新泄联合大学、诺丁汉大学。2024 年中期阶段共通过 121 支队伍，港澳台及海外赛区包括香港大学、香港科技大学、五大湖联合大学、关东联合大学、新加坡国立大学、德州农工大学等，预计 2026 年参赛队伍总数约为 118 支（预计区间：115–120 支），会刷掉约30-40支队伍
5. 中期文档的通过条件为文档评级在C以上，详情见https://bbs.robomaster.com/wiki/20204847/839168?source=7
6. 本赛季目标为顺利通过中期文档、完整形态等全部考核并正式参赛。2024 赛季止步于中期考核阶段，因此本赛季将以实现突破为核心目标，充分展示团队阶段性投入与整体努力成果。通过中期文档是本赛季必须完成的关键目标。
7. 各兵种汇报`;

// 页面元素
const viewMode = document.getElementById('viewMode');
const editMode = document.getElementById('editMode');
const editorTextarea = document.getElementById('editorTextarea');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const resetBtn = document.getElementById('resetBtn');

// 从localStorage加载保存的内容，如果没有则使用默认内容
let savedContent = localStorage.getItem('meetingMinutes');
if (!savedContent) {
    savedContent = meetingMinutesContent;
    localStorage.setItem('meetingMinutes', savedContent);
}

// 将文本转换为HTML格式
function formatContent(text) {
    // 将换行符转换为<br>，并保持格式
    return text
        .split('\n')
        .map(line => {
            line = line.trim();
            if (!line) return ''; // 空行不显示，删除<br>
            
            // 标题格式化 - 匹配 "X/X 会议大纲" 或包含"会议大纲"
            if (line.includes('会议大纲')) {
                return `<h3 class="meeting-title">${line}</h3>`;
            }
            
            // 匹配日期格式标题（如 "9/20", "10/25" 等）
            if (line.match(/^\d{1,2}\/\d{1,2}$/)) {
                return `<h3 class="meeting-title">${line}</h3>`;
            }
            
            // 数字列表
            if (line.match(/^\d+\./)) {
                return `<p class="meeting-item">${line}</p>`;
            }
            
            // 字母列表
            if (line.match(/^（[a-z]）/)) {
                return `<p class="meeting-subitem">${line}</p>`;
            }
            
            return `<p>${line}</p>`;
        })
        .filter(html => html !== '') // 过滤掉空字符串
        .join('');
}

// 显示内容
function displayContent() {
    viewMode.innerHTML = formatContent(savedContent);
}

// 初始化显示
displayContent();

// 编辑按钮
editBtn.addEventListener('click', function() {
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    
    editorTextarea.value = savedContent;
    editorTextarea.focus();
});

// 保存按钮
saveBtn.addEventListener('click', function() {
    savedContent = editorTextarea.value;
    localStorage.setItem('meetingMinutes', savedContent);
    
    displayContent();
    
    viewMode.style.display = 'block';
    editMode.style.display = 'none';
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
});

// 取消按钮
cancelBtn.addEventListener('click', function() {
    viewMode.style.display = 'block';
    editMode.style.display = 'none';
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
});

// 重置按钮
resetBtn.addEventListener('click', function() {
    if (confirm('确定要重置为最新的会议纪要内容吗？这将清除所有本地修改！')) {
        savedContent = meetingMinutesContent;
        localStorage.setItem('meetingMinutes', savedContent);
        displayContent();
        alert('内容已重置为最新版本！');
    }
});
