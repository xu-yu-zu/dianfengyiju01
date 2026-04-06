// 六边形坐标变换核心逻辑
class HexGame {
    constructor() {
        this.grid = []; // 存储所有格子状态
    }

    // 触发旋转逻辑 (巅峰弈局核心：踩中一点，内外圈转动)
    rotateBoard(centerX, centerY) {
        // 1. 获取第一圈邻居 (6个)
        const innerRing = this.getNeighbors(centerX, centerY, 1);
        // 2. 获取第二圈邻居 (12个)
        const outerRing = this.getNeighbors(centerX, centerY, 2);

        // 3. 执行旋转数组位移
        // 顺时针旋转第一圈
        this.shiftColors(innerRing, 1); 
        // 逆时针旋转第二圈
        this.shiftColors(outerRing, -1);
    }

    shiftColors(ring, direction) {
        // 获取环上所有格子的颜色序列
        const colors = ring.map(h => h.color);
        // 数组平移逻辑
        if (direction === 1) {
            colors.unshift(colors.pop()); // 顺时针
        } else {
            colors.push(colors.shift()); // 逆时针
        }
        // 将新颜色写回格子对象
        ring.forEach((h, i) => h.color = colors[i]);
    }
}