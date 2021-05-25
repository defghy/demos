/**
 * Copied from https://github.com/ETCExtensions/Edit-This-Cookie
 */
function cookieForCreationFromFullCookie(fullCookie) {
  var newCookie = {};
  //If no real url is available use: "https://" : "http://" + domain + path
  newCookie.url = "http" + ((fullCookie.secure) ? "s" : "") + "://" + fullCookie.domain + fullCookie.path;
  newCookie.name = fullCookie.name;
  newCookie.value = fullCookie.value;
  if (!fullCookie.hostOnly)
      newCookie.domain = fullCookie.domain;
  newCookie.path = fullCookie.path;
  newCookie.secure = fullCookie.secure;
  newCookie.httpOnly = fullCookie.httpOnly;
  if (!fullCookie.session)
      newCookie.expirationDate = fullCookie.expirationDate;
  newCookie.storeId = fullCookie.storeId;
  return newCookie;
}

/**
 * 获取给定hostname的环境，线上? test? other...
 * @param {string}} hostname hostname or domain
 */
function getEnv(hostname) {
  const head = hostname.split('.')[0]
  if(head.includes('-')) {
    return head.split('-')[0]
  } else {
    return ''
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ? '来自内容脚本：' + sender.tab.url : '来自扩展程序', request);

  if(sender.tab) {
    console.log(request);
    if (request.type === 'notification') {
      chrome.notifications.create({
        type:     'basic',
        iconUrl:  'logo.png',
        title:    'KwaiBI',
        message:  `${request.payload}有新反馈未锁单!`,
        priority: 0
      });
    }
    if (request.type === 'cookie') {
      chrome.cookies.getAll({name: 'kwaibi_user'}, function(cookies) {
        // 获取所有kwaibi_user缓存，并修改当前环境下天策和kwaibi的值
        console.log(cookies)
        const currentEnv = getEnv(new URL(sender.tab.url).hostname)
        console.log({ currentEnv })
        const filteredCookies = cookies.filter(cookie => getEnv(cookie.domain) === currentEnv)

        if(filteredCookies && filteredCookies.length > 0) {
          filteredCookies.forEach(cookie => {
            const newCookie = cookieForCreationFromFullCookie(cookie)
            newCookie.value = request.payload
            chrome.cookies.set(newCookie, function(){
              console.log('cookie set done...')
            })
          })
        }
      })
    }
  }
});

chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开百度才显示pageAction
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: '.com'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});