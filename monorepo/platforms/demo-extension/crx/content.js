/**
 * 修改反馈夜用户cookie，并自动刷新
 */
console.log('KwaiBI content.js loaded');
var urlObj = new URL(window.location.href);
var searchParams = urlObj.searchParams;
if (searchParams.has('exMockUser')) {
    var mockUser = searchParams.get('exMockUser');
    chrome.runtime.sendMessage({ type: 'cookie', payload: mockUser });
}
// document.addEventListener('DOMContentLoaded', function(){
// 	console.log('我被执行了！');
// });
