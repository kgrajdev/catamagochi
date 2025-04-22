/**
 * @returns {{x: number, y: number}}
 */
export function getRandomPointInPolygon(walkAreaPoints, walkPolygon) {
    // 2a) Compute bounding box from the corner array
    const pts = walkAreaPoints;
    let minX = pts[0].x, maxX = pts[0].x,
        minY = pts[0].y, maxY = pts[0].y;

    pts.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });

    // 2b) Rejection sample
    let x, y;
    do {
        x = Phaser.Math.Between(minX, maxX);
        y = Phaser.Math.Between(minY, maxY);
    } while (!Phaser.Geom.Polygon.Contains(walkPolygon, x, y));

    return { x, y };
}