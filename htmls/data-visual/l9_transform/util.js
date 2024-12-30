import { Vector2D } from '../util.js';

let gl;
let program;

const bindTriData = function() {
  const position = new Float32Array([
    -1, -1,
    0, 1,
    1, -1,
  ]);
  const bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

  const vPosition = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
};

function randomTriangles() {
  const u_color = [Math.random(), Math.random(), Math.random(), 1.0]; // 随机颜色
  const u_rotation = Math.random() * Math.PI; // 初始旋转角度
  const u_scale = Math.random() * 0.05 + 0.03; // 初始大小
  const u_time = 0;
  const u_duration = 3.0; // 持续3秒钟

  const rad = Math.random() * Math.PI * 2;
  const u_dir = [Math.cos(rad), Math.sin(rad)]; // 运动方向
  const startTime = performance.now();

  return {u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime};
}


function setUniforms(gl, {u_color, u_rotation, u_scale, u_time, u_duration, u_dir}) {
  // gl.getUniformLocation 拿到uniform变量的指针
  let loc = gl.getUniformLocation(program, 'u_color');
  // 将数据传给 unfirom 变量的地址
  gl.uniform4fv(loc, u_color);

  loc = gl.getUniformLocation(program, 'u_rotation');
  gl.uniform1f(loc, u_rotation);

  loc = gl.getUniformLocation(program, 'u_scale');
  gl.uniform1f(loc, u_scale);

  loc = gl.getUniformLocation(program, 'u_time');
  gl.uniform1f(loc, u_time);

  loc = gl.getUniformLocation(program, 'u_duration');
  gl.uniform1f(loc, u_duration);

  loc = gl.getUniformLocation(program, 'u_dir');
  gl.uniform2fv(loc, u_dir);
}

function run() {
  
  let triangles = [];

  function update() {
    if (false) {
      if (!triangles.length) {
        triangles.push(randomTriangles());
      }
    } else {
      for(let i = 0; i < 5 * Math.random(); i++) {
        triangles.push(randomTriangles());
      }
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    // 对每个三角形重新设置u_time
    triangles.forEach((triangle) => {
      triangle.u_time = (performance.now() - triangle.startTime) / 1000;
      setUniforms(gl, triangle);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
    // 移除已经结束动画的三角形
    triangles = triangles.filter((triangle) => {
      return triangle.u_time <= triangle.u_duration;
    });
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

export const start = function(g, p) {
  gl = g;
  program = p;
  
  bindTriData();
  run();
};