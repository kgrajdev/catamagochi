export function devTestWalkArea(walkAreaPoints) {
    walkAreaPoints.forEach((corner, idx) => {
        this.add.text(corner.x, corner.y, ''+idx, {color: '#ff1111'}).setDepth(9999);
    })
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000, 1); // (thickness, color, alpha)

    // Draw the 4 lines using moveTo and lineTo
    graphics.beginPath();

    for (let i = 0; i < walkAreaPoints.length; i++) {
        const start = walkAreaPoints[i];
        const end = walkAreaPoints[(i + 1) % walkAreaPoints.length]; // loops back to 0 at the end

        graphics.moveTo(start.x, start.y);
        graphics.lineTo(end.x, end.y);
    }
    graphics.strokePath().setDepth(9999);
}