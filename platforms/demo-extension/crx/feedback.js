/**
 * 相当于为网页添加额外脚本
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
console.log('KwaiBI tools loaded');
var AUTO_REFRESH = 'AUTO_REFRESH';
var REFRESH_INTERVAL = 'REFRESH_INTERVAL';
var CONCERNED_PRODUCTS = ['天策', 'KwaiBI'];
var handle;
var config = {};
function isUndefined(val) {
    return typeof val === 'undefined';
}
function refresh() {
    window.location.reload();
    // window.open('https://www.baidu.com')
}
function generateUrl(baseUrl, params) {
    var urlObj = new URL(baseUrl);
    var origin = urlObj.origin, pathname = urlObj.pathname, searchParams = urlObj.searchParams;
    for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        searchParams.append(key, value);
    }
    var finalUrl = urlObj.toString();
    console.log(finalUrl);
    return finalUrl;
}
function updateTimeout() {
    var autoRefresh = config.AUTO_REFRESH, interval = config.REFRESH_INTERVAL;
    if (isUndefined(autoRefresh) || isUndefined(interval)) {
        return;
    }
    console.log({ config: config });
    if (autoRefresh) {
        handle = window.setTimeout(refresh, (interval || 60) * 1000);
    }
    else {
        handle && clearTimeout(handle);
    }
}
function createNotification(product) {
    chrome.runtime.sendMessage({ type: 'notification', payload: product });
}
function getTableData() {
    setTimeout(function () {
        var tableBody = document.querySelector('.ant-table-tbody');
        var list = tableBody ? tableBody.querySelectorAll('tr') : [];
        // 格式化表格数据，存储行DOM和关键数据
        var allTableData = Array.from(list).map(function (row) {
            var feedBackEl = row.querySelector('.feedback-info-content');
            var _a = (feedBackEl === null || feedBackEl === void 0 ? void 0 : feedBackEl.querySelector('a')) || {}, _b = _a.href, url = _b === void 0 ? '' : _b, _c = _a.innerText, product = _c === void 0 ? '' : _c;
            var userEle = feedBackEl === null || feedBackEl === void 0 ? void 0 : feedBackEl.querySelector('.user .value');
            var user = userEle.innerText.split(/\s+/);
            var isLocked = !!row.querySelector('.icon-lock');
            var userName = user[1];
            return {
                el: row,
                product: product,
                url: url,
                userName: userName,
                isLocked: isLocked
            };
        });
        // 筛选未锁定，且为目标产品
        var filteredData = allTableData.filter(function (data) {
            return CONCERNED_PRODUCTS.includes(data.product);
        });
        console.log({ filteredData: filteredData });
        filteredData.forEach(function (item) {
            var _a;
            var url = item.url, userName = item.userName;
            var button = document.createElement('div');
            button.className = 'admin-btn ex-appended-btn';
            button.style.cssText = 'text-decoration: underline; background: transparent; color: #333;';
            button.innerText = '跳转反馈url';
            button.addEventListener('click', function () {
                url && window.open(generateUrl(url, { exMockUser: userName }));
            });
            (_a = item.el.querySelector('.btn-wrap')) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement('beforeend', button);
        });
        // 是否存在未锁单的数据
        var unLockData = filteredData.filter(function (item) { return !item.isLocked; });
        if (unLockData && unLockData.length > 0) {
            var product = unLockData[0].product;
            // 生成问题反馈url，并url添加用户名以修改cookie
            // url && window.open(generateUrl(url, { exMockUser: userName }))
            // 存在未锁单的反馈则给出提示
            createNotification(product);
        }
    }, 2000);
}
// 页面加载完成，获取当前插件配置
window.addEventListener('load', function () {
    console.log('loaded');
    // 设置定时器配置
    chrome.storage.local.get([AUTO_REFRESH, REFRESH_INTERVAL], function (item) {
        config = item;
        updateTimeout();
    });
    // 获取当前tab表格数据
    getTableData();
});
// 配置更新
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type == 'update') {
        config = __assign(__assign({}, config), msg.payload);
        updateTimeout();
    }
});
