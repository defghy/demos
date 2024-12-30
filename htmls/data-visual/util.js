/**
 * 获取圆周的坐标值
 * @param cx 圆心x
 * @param cy 圆心y
 * @param r  半径
 * @param angle 角度，以y轴开始
 * @returns {*[]}
 */
const arcPoint = (cx, cy, r, angle) => {
  const radian = (angle) => angle * (Math.PI / 180);
  return [cx + r * Math.sin(radian(angle)), cy - r * Math.cos(radian(angle))];
};

/**
 * 正圆的弧形
 * @param cx  圆心x
 * @param cy  圆心y
 * @param angleStart  起始角度
 * @param angleEnd  结束角度
 * @returns {{d: string}}
 */
const arc = ({ cx, cy, r, angleStart, angleEnd }) => {
  cx = cx || r;
  cy = cy || r;
  const largeArcFlag = angleEnd - angleStart > 180 ? 1 : 0;

  const d = [
    `M${arcPoint(cx, cy, r, angleStart).join(',')}`,
    `A${r},${r} 0 ${largeArcFlag},1 ${arcPoint(cx, cy, r, angleEnd).join(',')}`
  ];
  return d.join(' ');
};

/**
 * 正圆的弧形
 * @param cx  圆心x
 * @param cy  圆心y
 * @param angleStart  起始角度
 * @param angleEnd  结束角度
 * @returns {{d: string}}
 */
const fan = ({ cx, cy, r, angleStart, angleEnd }) => {
  cx = cx || r;
  cy = cy || r;
  const largeArcFlag = angleEnd - angleStart > 180 ? 1 : 0;

  const d = [
    `M${cx} ${cy}`,
    `L${arcPoint(cx, cy, r, angleStart).join(' ')}`,
    `A${r},${r} 0 ${largeArcFlag},1 ${arcPoint(cx, cy, r, angleEnd).join(',')}`,
    'Z',
  ];
  return d.join(' ');
};

export class Vector2D extends Array {
  constructor(x = 1, y = 0) {
    super(x, y);
  }

  set x(v) {
    this[0] = v;
  }

  set y(v) {
    this[1] = v;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get len() {
    return Math.hypot(this.x, this.y);
  }

  get dir() {
    return Math.atan2(this.y, this.x);
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(a) {
    this.x *= a;
    this.y *= a;
    return this;
  }

  cross(v) {
    return this.x * v.y - v.x * this.y;
  }

  dot(v) {
    return this.x * v.x + v.y * this.y;
  }

  normalize() {
    return this.scale(1 / this.len);
  }

  rotate(rad) {
    const c = Math.cos(rad),
      s = Math.sin(rad);
    const [x, y] = this;

    this.x = x * c + y * -s;
    this.y = x * s + y * c;

    return this;
  }
}

export {
	arcPoint,
  arc,
  fan
};