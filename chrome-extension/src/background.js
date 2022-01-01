import api from '@/utils/api';

globalThis.api = api;

chrome.runtime.onInstalled.addListener(function(){
  chrome.action.disable();
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 特殊页面展示 popup
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '.' }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '.' }
          })
        ],
        actions: [
          // new chrome.declarativeContent.SetIcon({ path: './logo.png' }),
          new chrome.declarativeContent.ShowAction(),
        ]
      }
    ]);
	});
});