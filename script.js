// 運勢與顏色配置 (紅色大吉、黃色中吉、藍色小吉、白色末吉)
const FORTUNES = [
    {
        type: '大吉',
        color: '#ff4d4d', // 紅色
        textColor: '#ffffff',
        desc: '🎉 大吉：$500內壽星指定'
    },
    {
        type: '中吉',
        color: '#ffca28', // 黃色
        textColor: '#000000',
        desc: '✨ 中吉：一杯調酒'
    },
    {
        type: '小吉',
        color: '#42a5f5', // 藍色
        textColor: '#ffffff',
        desc: '🎐 小吉：一杯手搖'
    },
    {
        type: '末吉',
        color: '#ffffff', // 白色
        textColor: '#000000',
        desc: '🤍 末吉：生日快樂🎊'
    }
];

// --- 1. 分頁選單切換 ---
const menuButtons = document.querySelectorAll('.menu-btn');
const gameSections = document.querySelectorAll('.game-section');

menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        menuButtons.forEach(b => b.classList.remove('active'));
        gameSections.forEach(s => s.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// --- 彈出視窗 Modal 控制 ---
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBall = document.getElementById('modal-ball');
const modalDesc = document.getElementById('modal-desc');
const modalCloseBtn = document.getElementById('modal-close-btn');

function showModal(title, fortuneObj) {
    modalTitle.textContent = title;
    modalBall.textContent = fortuneObj.type;
    modalBall.style.backgroundColor = fortuneObj.color;
    modalBall.style.color = fortuneObj.textColor;
    modalDesc.textContent = fortuneObj.desc;
    modalOverlay.classList.add('active');
}

modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

// --- 2. 模式一：轉盤邏輯 (100% 精準修復版) ---
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
let currentDegree = 0; // 記錄當前累積旋轉角度

spinBtn.addEventListener('click', () => {
    spinBtn.disabled = true;

    // 1. 定義 6 個獎項 (必須與 CSS 的 conic-gradient 順序、角度完全一致)
    const items = ["反請麻糬一杯飲料", "$200內壽星指定", "再轉一次", "一杯調酒", "一杯手搖", "原神小月卡"];
    const totalSlices = items.length; // 6
    const sliceAngle = 360 / totalSlices; // 每格 60 度

    // 2. 隨機決定這次要抽中哪一個索引 (0 到 5)
    const winningIndex = Math.floor(Math.random() * totalSlices);

    // 3. 計算該獎項在轉盤上的「中心點角度」
    // 因為 CSS 扇形是順時針排布：
    // 第 0 格範圍是 0~60度，中心點在 30度
    const targetSliceCenter = (winningIndex * sliceAngle) + (sliceAngle / 2);

    // 4. 因為指針在正上方 (0度 / 360度)，當轉盤順時針轉動時，
    // 要讓某個角度轉到正上方，轉盤需要轉的總度數公式為：(360 - 該區塊中心角度)
    const extraSpins = 360 * 6; // 多轉 6 圈增加動畫刺激感
    
    // 計算出這次目標總共要達到的絕對度數
    // 為了防止角度無限放大導致瀏覽器渲染怪異，我們用當前度數去算「下一個完整多圈位置」
    const currentMod = currentDegree % 360;
    const targetMod = (360 - targetSliceCenter) % 360;
    
    // 計算差距並補足圈數
    let degreeDiff = targetMod - currentMod;
    if (degreeDiff <= 0) {
        degreeDiff += 360;
    }
    
    currentDegree += extraSpins + degreeDiff;

    // 5. 套用旋轉動畫
    wheel.style.transform = `rotate(${currentDegree}deg)`;

    // 6. 等待 4 秒動畫結束後跳出視窗
    setTimeout(() => {
        spinBtn.disabled = false;
        
        showModal("🎡 轉盤結果", {
            type: "驚喜",
            color: "#ff6b6b",
            textColor: "#ffffff",
            desc: `恭喜抽中：「${items[winningIndex]}」！`
        });
    }, 4000);
});

// --- 3. 模式二：扭蛋開球邏輯 ---
const glassGlobe = document.getElementById('glass-globe');
const gachaBtn = document.getElementById('gacha-btn');
const chuteCover = document.getElementById('chute-cover');

function initGachaGlobe() {
    glassGlobe.innerHTML = '';
    const ballColors = ['#ff4d4d', '#ffca28', '#42a5f5', '#ffffff'];
    for (let i = 0; i < 12; i++) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.style.backgroundColor = ballColors[i % ballColors.length];
        ball.style.left = `${Math.random() * 150 + 10}px`;
        ball.style.top = `${Math.random() * 140 + 20}px`;
        glassGlobe.appendChild(ball);
    }
}
initGachaGlobe();

gachaBtn.addEventListener('click', () => {
    gachaBtn.disabled = true;
    chuteCover.textContent = '?';
    chuteCover.style.backgroundColor = '#3a3258';
    chuteCover.style.color = '#ffd166';

    const balls = glassGlobe.querySelectorAll('.ball');
    let timer = setInterval(() => {
        balls.forEach(b => {
            b.style.left = `${Math.random() * 150 + 10}px`;
            b.style.top = `${Math.random() * 140 + 20}px`;
        });
    }, 100);

    setTimeout(() => {
        clearInterval(timer);
        const result = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        
        chuteCover.textContent = result.type[0];
        chuteCover.style.backgroundColor = result.color;
        chuteCover.style.color = result.textColor;

        setTimeout(() => {
            showModal("🔮 扭蛋結果出爐", result);
            gachaBtn.disabled = false;
        }, 500);
    }, 1800);
});

// --- 4. 模式三：搖盒抽籤邏輯 ---
const lotteryBox = document.getElementById('lottery-box');
const lotteryBtn = document.getElementById('lottery-btn');
const drawnStick = document.getElementById('drawn-stick');
const stickText = document.getElementById('stick-text');

lotteryBtn.addEventListener('click', () => {
    lotteryBtn.disabled = true;
    drawnStick.classList.remove('show');
    lotteryBox.classList.add('shake');

    setTimeout(() => {
        lotteryBox.classList.remove('shake');
        const result = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];

        drawnStick.style.backgroundColor = result.color;
        stickText.style.color = result.textColor;
        stickText.textContent = result.type;
        drawnStick.classList.add('show');

        setTimeout(() => {
            showModal("⛩️ 生日運勢籤詩", result);
            lotteryBtn.disabled = false;
        }, 600);
    }, 1500);
});
