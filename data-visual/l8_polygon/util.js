import { Vector2D } from '../util.js';
import { earcut } from '../assets/earcut.js';
import Tess2 from '../assets/tess2.js';

export function draw(context, points, {
  fillStyle = 'black',
  close = false,
  rule = 'nonzero',
} = {}) {
  context.beginPath();
  context.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    context.lineTo(...points[i]);
  }
  if(close) context.closePath();
  context.fillStyle = fillStyle;
  context.fill(rule);
}

function inTriangle(p1, p2, p3, point) {
  const a = p2.copy().sub(p1);
  const b = p3.copy().sub(p2);
  const c = p1.copy().sub(p3);

  const u1 = point.copy().sub(p1);
  const u2 = point.copy().sub(p2);
  const u3 = point.copy().sub(p3);

  const isSameLine = (v1, v2) => {
    let p = v1.dot(v2) / v1.length ** 2;
    return p >=0 && p <= 1;
  }

  const s1 = Math.sign(a.cross(u1));
  if(s1 === 0 && isSameLine(a, u1)) return true;

  const s2 = Math.sign(b.cross(u2));
  if(s2 === 0 && isSameLine(b, u2)) return true;

  const s3 = Math.sign(c.cross(u3));
  if(s3 === 0 && isSameLine(c, u3)) return true;

  return s1 === s2 && s2 === s3;
}

export function isPointInPath({vertices, cells}, point) {
  let ret = false;
  for(let i = 0; i < cells.length; i += 3) {
    const p1 = new Vector2D(...vertices[cells[i]]);
    const p2 = new Vector2D(...vertices[cells[i + 1]]);
    const p3 = new Vector2D(...vertices[cells[i + 2]]);
    if(inTriangle(p1, p2, p3, point)) {
      ret = true;
      break;
    }
  }
  return ret;
}

export const triangleSplit = {
  earcut(polygon) {
    const vertices = polygon;
    const points = vertices.flat();
    const triangles = earcut(points);

    return triangles;
  },
  tess2(polygon) {
    const points = polygon.flat();
    // var ca = [0,0, 10,0, 5,10, 0,2, 10,2, 10,6, 0,6].map(item => item / 20);
    const res = Tess2.tesselate({
        contours: [points],
        windingRule: Tess2.WINDING_ODD,
        elementType: Tess2.POLYGONS,
        polySize: 3,
        vertexSize: 1,
        strict: false
    });
    return res.elements;
  }
};