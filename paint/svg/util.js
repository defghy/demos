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
const arc = (cx, cy, r, angleStart, angleEnd) => {
  const largeArcFlag = angleEnd - angleStart > 180 ? 1 : 0;

  const d = [
    `M${arcPoint(cx, cy, r, angleStart).join(',')}`,
    `A${r},${r} 0 ${largeArcFlag},1 ${arcPoint(cx, cy, r, angleEnd).join(',')}`
  ];
  return d.join(' ');
};

export {
	arcPoint,
	arc
};