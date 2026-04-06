const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let hexagons = [];
const hexRadius = 42; // 格子大小
const gridRadius = 5; // 蜂窝层数

// 初始化布局
function init() {
    window.addEventListener('resize', resize);
    resize();
    createGrid();
    animate();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// 使用轴向坐标系创建标准蜂窝布局
function createGrid() {
    hexagons = [];
    for (let q = -gridRadius; q <= gridRadius; q++) {
        let r1 = Math.max(-gridRadius, -q - gridRadius);
        let r2 = Math.min(gridRadius, -q + gridRadius);
        for (let r = r1; r <= r2; r++) {
            hexagons.push(new Hex(q, r));
        }
    }
}

class Hex {
    constructor(q, r) {
        this.q = q;
        this.r = r;
        // 赛题三种颜色
        const colors = ['#1a1a1a', '#ff1e56', '#00a8ff', '#39FF14']; 
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.updatePos();
    }

    updatePos() {
        const x = hexRadius * (Math.sqrt(3) * this.q + Math.sqrt(3)/2 * this.r);
        const y = hexRadius * (3/2 * this.r);
        this.x = x + canvas.width / 2;
        this.y = y + canvas.height / 2;
    }

    draw() {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + (Math.PI / 6);
            ctx.lineTo(this.x + hexRadius * 0.95 * Math.cos(angle), 
                       this.y + hexRadius * 0.95 * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#003300';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 增加科技感边框
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
        ctx.stroke();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hexagons.forEach(h => {
        h.updatePos();
        h.draw();
    });
    requestAnimationFrame(animate);
}

// 核心逻辑：获取环绕格并旋转
function getRing(center, dist) {
    return hexagons.filter(h => {
        const d = (Math.abs(center.q - h.q) + 
                  Math.abs(center.q + center.r - h.q - h.r) + 
                  Math.abs(center.r - h.r)) / 2;
        return Math.round(d) === dist;
    }).sort((a, b) => Math.atan2(a.y - center.y, a.x - center.x) - 
                      Math.atan2(b.y - center.y, b.x - center.x));
}

function rotateRing(center, dist, clockwise) {
    const ring = getRing(center, dist);
    if (ring.length === 0) return;
    const colors = ring.map(h => h.color);
    if (clockwise) colors.unshift(colors.pop());
    else colors.push(colors.shift());
    ring.forEach((h, i) => h.color = colors[i]);
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = hexagons.find(h => Math.hypot(h.x - x, h.y - y) < hexRadius);
    if (clicked) {
        rotateRing(clicked, 1, true);  // 内圈顺时针
        rotateRing(clicked, 2, false); // 外圈逆时针
    }
});

init();