import { Vector2D as Vector } from './util.js';

// 点 p 到 直线 qr 的距离
function point2lineLen(p, q, r) {
  const v1 = new Vector(p.x - q.x, p.y - q.y);
  const v2 = new Vector(r.x - q.x, r.y - q.y);
  const  cross = v1.cross(v2).len();
  return cross / v2.len();
}

// 点 p 到 线段 qr 的距离
function point2segmentLen(p, q, r) {
  const isAcuteAngle = (v1, v2) => {
    const cos = v1.normalize().dot(v2.normalize());
    const angle = Math.acos(cos);
    return angle >= 0 && angle <= 1;
  };

  const v1 = new Vector(p.x - q.x, p.y - q.y);
  const v2 = new Vector(r.x - q.x, r.y - q.y);

  const v3 = new Vector(p.x - r.x, p.y - r.y);
  const v4 = new Vector(q.x - r.x, q.y - r.y);

  const inSegment = isAcuteAngle(v1, v2) && isAcuteAngle(v3, v4);
  // 取正交距离 或者 2个端点最小的那个
  return inSegment ? point2lineLen(p, q, r) : Math.min(v1.len, v3.len);
}