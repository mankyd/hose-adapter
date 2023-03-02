import * as THREE from 'three';

export function createStraight(shiftY, len, radius) {
    const points = [
        new THREE.Vector2(radius, shiftY), 
        new THREE.Vector2(radius, shiftY + len), 
    ];

    return points;
}

export function createCurve(offsetY, offsetX, len, radius, resolution) {
    if (Math.abs(len) > Math.abs(radius)) {
        len = radius;
    }

    const ellipse = new THREE.EllipseCurve(
        radius > 0 ? offsetX - radius : offsetX - radius,
        offsetY,
        radius,
        radius,
        radius < 0 ? -Math.PI - Math.acos(len / radius) : 0,
        radius < 0 ? 0 : Math.PI / 2 - Math.acos(len / radius),
        radius < 0,
        );
    return ellipse.getPoints(resolution);
}

export function createTangent(offsetY, radiusA, xA, yA, radiusB, xB, yB) {
    console.log(calculateTangentLines(xA, yA, radiusA, xB, yB, radiusB));

    return [];
}

export function calculateTangentLines(x1, y1, r1, x2, y2, r2) {
  // Compute the common tangent line of two circles: (x1, y1) - r1 and (x2, y2) - r2
  // Return in the form of line equation: ax + by + c == 0
  let delta1 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) - (r1 + r2) * (r1 + r2);
  let delta2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) - (r1 - r2) * (r1 - r2);
  let p1 = r1 * (x1 * x2 + y1 * y2 - x2 * x2 - y2 * y2);
  let p2 = r2 * (x1 * x1 + y1 * y1 - x1 * x2 - y1 * y2);
  let q = x1 * y2 - x2 * y1;
  let results = [];
  if(delta1 >= 0) {
    let l11 = {
      a: (x2 - x1) * (r1 + r2) + (y1 - y2) * Math.sqrt(delta1),
      b: (y2 - y1) * (r1 + r2) + (x2 - x1) * Math.sqrt(delta1),
      c: p1 + p2 + q * Math.sqrt(delta1)
    };
    let l12 = {
      a: (x2 - x1) * (r1 + r2) - (y1 - y2) * Math.sqrt(delta1),
      b: (y2 - y1) * (r1 + r2) - (x2 - x1) * Math.sqrt(delta1),
      c: p1 + p2 - q * Math.sqrt(delta1)
    };
    results.push(l11);
    results.push(l12);
  }
  if(delta2 >= 0) {
    let l21 = {
      a: (x2 - x1) * (r1 - r2) + (y1 - y2) * Math.sqrt(delta2),
      b: (y2 - y1) * (r1 - r2) + (x2 - x1) * Math.sqrt(delta2),
      c: p1 - p2 + q * Math.sqrt(delta2)
    };
    let l22 = {
      a: (x2 - x1) * (r1 - r2) - (y1 - y2) * Math.sqrt(delta2),
      b: (y2 - y1) * (r1 - r2) - (x2 - x1) * Math.sqrt(delta2),
      c: p1 - p2 - q * Math.sqrt(delta2)
    };
    results.push(l21);
    results.push(l22);
  }
  return results;
}