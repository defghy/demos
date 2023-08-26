import { produce, enablePatches, applyPatches } from 'immer';

enablePatches();

let data = {
    nodes: [{ id: 1, name: '节点1' }, { id: 2, name: '节点2' }],
    edges: [{ source: 1, target: 2 }],
};

const snapData: any = {
    index: -1,
    list: [],
};

const createSnap = function(state: any, change: any) {
    return produce(state, draft => {
        change(draft);
    }, (redoPatch, undoPatch) => {
        snapData.index++;
        snapData.list.push({
            redo: redoPatch,
            undo: undoPatch,
        });
    });
};

// 加一个节点
data = createSnap(data, (data) => {
    data.nodes.push({id: 3, name: '节点3'});
})

// 加一条边
data = createSnap(data, (data) => {
    data.edges.push({ source: 2, target: 3 });
})

export const undo = function() {
    const curr = snapData.list[snapData.index];
    data = applyPatches(data, curr.undo);
    snapData.index--;
};
export const redo = function() {
    snapData.index++;
    const curr = snapData.list[snapData.index];
    data = applyPatches(data, curr.redo);
};

console.log(data);
undo();
console.log('undo 1', data);
redo();
console.log('redo 1', data);
undo();
undo();
console.log('undo 2time', data);
redo();
redo();
console.log('redo 2time', data);