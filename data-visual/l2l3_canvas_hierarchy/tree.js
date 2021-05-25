// 遍历查找
export function searchTree(root = {}, callback) {
    if (Array.isArray(root)) {
        root = {
            children: root,
        };
    }
    function traverse(root) {
        const children = root.children || [];
        const result = callback(root);
        if (result) {
            return root;
        }
        for (let i = 0, len = children.length; i < len; i++) {
            const node = traverse(children[i]);
            if (node) {
                return node;
            }
        }
        return result;
    }
    return traverse(root);
}

export const circle = function(ctx, x, y, r, color = 'rgba(0, 0, 0, 0.2)') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
};
export const text = function(ctx, name, x, y, color='white') {
  ctx.fillStyle = color;
  ctx.font = '1.5rem Arial';
  ctx.textAlign = 'center';
  ctx.fillText(name, x, y);
};
