import * as THREE from 'three';

export function createStraight(shiftY, len, radius) {
    const points = [
        new THREE.Vector2(radius, shiftY), 
        new THREE.Vector2(radius, shiftY + len), 
    ];

    return points;
}

export function createCurve(centerX, centerY, radius, endX, endY, resolution) {
    // if (Math.abs(len) > Math.abs(radius)) {
    //     len = radius;
    // }

    console.log(radius);
    console.log(Math.atan((endY - centerY) / Math.abs(endX - centerX)))
    const ellipse = new THREE.EllipseCurve(
        centerX,
        centerY,
        radius,
        radius,
        radius > 0 ? 0 : Math.atan((endY - centerY) / (endX - centerX)), // start angle
        radius > 0 ? Math.atan((endY - centerY) / (endX - centerX)) : 0, // end angle
        //0,
        //2* Math.PI,
        // radius < 0 ? -Math.PI - Math.acos(len / radius) : 0,
        // radius < 0 ? 0 : Math.PI / 2 - Math.acos(len / radius),
        radius < 0
        );
    return ellipse.getPoints(resolution);
}

export function createTangent(shiftY, radiusA, xA, yA, radiusB, xB, yB) {
  yA += shiftY;
  yB += shiftY;
  let tangentLines = calculateTangentLines(xA, yA, radiusA, xB, yB, radiusB);
  //console.log(tangentLines);
  let l11 = tangentLines[3];

  return [
    new THREE.Vector2(l11[0], l11[1]),
    new THREE.Vector2(l11[2], l11[3]),
  ];
}

export function calculateTangentLines(x1, y1, r1, x2, y2, r2) {
  let d_sq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  if (d_sq <= (r1-r2)*(r1-r2)) {
    return [];
  }

  let d = Math.sqrt(d_sq);
  let vx = (x2 - x1) / d;
  let vy = (y2 - y1) / d;

  let res = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  let i = 0;

  for (let sign1 = +1; sign1 >= -1; sign1 -= 2) {
    let c = (r1 - sign1 * r2) / d;

    // Now we're just intersecting a line with a circle: v*n=c, n*n=1

    if (c*c > 1.0) continue;
    let h = Math.sqrt(Math.max(0.0, 1.0 - c*c));

    for (let sign2 = +1; sign2 >= -1; sign2 -= 2) {
        let nx = vx * c - sign2 * h * vy;
        let ny = vy * c + sign2 * h * vx;

        let a = res[i++];
        a[0] = x1 + r1 * nx;
        a[1] = y1 + r1 * ny;
        a[2] = x2 + sign1 * r2 * nx;
        a[3] = y2 + sign1 * r2 * ny;
    }
  }

  return res;
}