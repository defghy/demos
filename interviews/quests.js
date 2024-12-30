/* 
  JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。完善代码中Scheduler类，使得以下程序能正确输出：
*/
class Scheduler {
  queue = [];
  stack = [];
  add(promiseCreator) { 
    return new Promise((resolve, reject) => {
      this.stack.push({ creator: promiseCreator, resolve, reject });
      this.next();
    });
  }
  
  next() {
    if (!this.stack.length || this.queue.length >= 2) {
      return;
    }
    
    const data = this.stack.shift();
    const nextItem = data.creator().then(res => {
      data.resolve(res);

      const index = this.queue.findIndex(j => j === nextItem);
      this.queue.splice(index, 1);

      this.next();
    });
    this.queue.push(nextItem);
  }
}

const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')


/* 
  手动实现 Promise
*/
class Promise {
  
  thenCbs = []
  catchCbs = []
  nextRejects = []
  state = 'pending'
  resolveData = null
  rejectData = null
  
  constructor(init) {
    try {
      init(this.resolve, this.reject);
    } catch(e) {
      this.reject(e);
    }
  }
  
  resolve = (data) => {
    if (this.state !== 'pending') {
      return;
    }
    this.state = 'resolved';
    this.resolveData = data;
    while(this.thenCbs.length) {
      this.thenCbs.shift()(data);
    }
  }

  reject = (e) => {
    if (this.state !== 'pending') {
      return;
    }
    this.state = 'rejected';
    this.rejectData = e;
    if (this.catchCbs.length > 0) {
      while(this.catchCbs.length) {
        this.catchCbs.shift()(e);
      }     
    } else {
      while(this.nextRejects.length) {
        this.nextRejects.shift()(e);
      }     
    }
  }
  
  then(callback) {
    return new Promise((resolve, reject) => {
      const cb = this.wrapCallback(callback, resolve, reject);
      if (this.state === 'resolved') {
        cb(this.resolveData);
      } else if (this.state === 'pending') {
        this.thenCbs.push(cb);
        this.nextRejects.push(reject);
      } else {
        reject(this.rejectData);
      }
    });
  }
  
  'catch'(callback) {
    return new Promise((resolve, reject) => {
      const cb = this.wrapCallback(callback, resolve, reject);
      if (this.state === 'rejected') {
        cb(this.rejectData);
      } else if (this.state === 'pending') {
        this.catchCbs.push(cb);
      }
    });
  }

  wrapCallback(callback, resolve, reject) {
    return (data) => {
      let res;
      try {
        res = callback(data);
      } catch(err)  {
        return reject(err);
      }
      
      if (res?.then && res?.catch) {
        return res.then(r => resolve(r)).catch(e => reject(e));
      } else {
        return resolve(res);
      }
    };
  }
}

var a = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('test'));
  }, 0);
}).then(res => {
  console.log(res);
  return res;
}).catch(e => {
  console.log(e);
})

// 手动实现 Map
class Map {
  dict = {};
  uid = 0;
  uidPre = Math.random();
  set(key, value) {
    const dictKey = this.key(key);
    const dictArr = this.dict[dictKey] || [];
    const target = dictArr.find(t => t.key === key);
    if (target) {
      target.value = value;
    } else {
      dictArr.push({key, value});
    }
    
    this.dict[dictKey] = dictArr;
  }
  get(key) {
    const dictKey = this.key(key);
    const dictArr = this.dict[dictKey] || [];
    return ((dictArr || []).find(t => t.key === key) || {}).value || null;
  }
  key(k) {
    if (typeof k === 'object') {
      if (!k._unique_id) {
        k._unique_id = `${this.uidPre}${this.uid++}`
      }

      return k._unique_id;
    } else {
      return k +'';
    }
  }
}

// 最多下载3张图片

const downImage = function(urls) {
  return new Promise((resolve) =>  {
    const queue = [];
    while(queue.length < 3 && urls.length) {
        insertImage();
    }

    function insertImage() {
      if (!urls.length) {
        return;
      }
      const imageUrl = urls.shift();
      function imageLoad() {
        let img = new Image(imageUrl);
        return new Promise(resolve => {
          img.onLoad = resolve;
        });
      };
      
      const run = imageLoad().then(function() {
        const curr = queue.findIndex(i => i === run);
        queue.splice(curr, 1);

        if (!urls.length && !queue.length) {
          resolve();
        }  else if (urls.length) {
          insertImage();
        }
      });
      queue.push(run);
    }
  });
};

class ImageSchedule {
  urls = [];
  queue = [];
  allDone = function() {};

  constructor(urls) {
    this.urls = urls;

    while(this.queue.length < 3 && this.urls.length) {
      this.insertRun();
    }

    return new Promise(resolve => {
      this.allDone = resolve;
    });
  }

  insertRun() {
    if (!this.urls.length) {
      return;
    }

    const imgUrl = this.urls.shift();
    const run = this.imageLoad(imgUrl).then(() => this.imgDone(run));

    this.queue.push(run);
  }

  imgDone(run) {
    const curr = this.queue.findIndex(i => i === run);
    this.queue.splice(curr, 1);

    if (!this.urls.length && !this.queue.length) {
      this.allDone();
    }  else if (this.urls.length) {
      this.insertRun();
    }
  }

  imageLoad(url) {
    let img = new Image(url);
    img.src = url;

    return new Promise(resolve => {
      img.onload = resolve;
    });
  }
}

new ImageSchedule(['1', '2']);

// 深拷贝
const deepClone = function(obj) {
  const cache = {};
  const uuid = (function() {
    let idx = 1;
    return function() {
      return idx++;
    };
  })();
  const cacheInit = function(source) {
    source._uuid = source._uuid || uuid();
    if (cache[source._uuid]) {
      return cache[source._uuid];
    }

    const res = { _uuid: source._uuid, cloned: false };
    cache[source._uuid] = res;

    return res;
  };
  const cloneObj = function(source) {
    const dest = cacheInit(source);
    if (cache[source._uuid] && cache[source._uuid].cloned) {
      return cache[source._uuid];
    }
    cache[source._uuid].cloned = true;
   
    Object.keys(source).forEach(curr => {
      const v = source[curr];
      if ([ 'string', 'number', 'function', 'boolean' ].includes(typeof v)) {
        dest[curr] = v;
      } else if (['object'].includes(typeof v)) {
        const currDest = cloneObj(v);
        dest[curr] = currDest;
      }
    });
    
    return dest;
  };

  return cloneObj(obj);
};

var a = {};
a.b = a;
var c = deepClone(a);

// [1, 2, 6, 10, 5, 4, 8, 3] => 10
var add = function(start, end, total) {
  if (start > end) {
    return [];
  }

  let res1 = [];
  if (arr[start] === total) {
    res1 = [arr[start]];
  } else if (total - arr[start] > 0){
    res1 = add(start + 1, end, total - arr[start]).map(r => [arr[start]].concat(r));
  }

  const res2 = add(start + 1, end, total);

  return res1.concat(res2);
}

add(0, arr.length - 1, 10);


// 洋葱模型
class App {
  mids = []

  async execute(ctx) {
    const responseMid = {
      run: () => {
        const response = async function () {};
        const res = response(ctx, () => Promise.resolve());
        responseMid.preWait = res;
        responseMid.aftWait = res;
        responseMid.nextResolve = function() {};
        return res;
      }
    };
    this.mids.push(responseMid);

    for(let i=0; i< this.mids.length; i++) {
      const mid = this.mids[i];
      mid.run(ctx);
      await mid.preWait;
    }

    for(let i=this.mids.length - 1; i>=0; i--) {
      const mid = this.mids[i];
      await mid.aftWait;
      if (i - 1 >= 0) {
        this.mids[i - 1].nextResolve();
      }
    }
  }

  use(fn) {
    this.mids.push(this.wrapper(fn));
  }

  wrapper = (fn) => {
    const run = (ctx) => {
      let beforeResolve = null;
      middleware.preWait = new Promise( (resolve, reject) => {
        beforeResolve  = resolve;
      });
      const next = () => new Promise( (resolve, reject) => {
        beforeResolve();
        middleware.nextResolve = resolve;
      });
      middleware.aftWait = fn(ctx, next);
      return middleware.aftWait;
    };

    const middleware = {
      run: run,
      preWait: null,
      nextResolve: null,
      aftWait:  null
    };

    return middleware;
  }
}

var app = new App();

app.use(async function(ctx, next) {
  console.log('a');
  await next();
  console.log('enda');
});
app.use(async function(ctx, next) {
  console.log('b');
  await next();
  console.log('endb');
});
app.use(async function(ctx, next) {
  console.log('c');
  await next();
  console.log('endc');
});
