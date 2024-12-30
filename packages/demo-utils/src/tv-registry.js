const urls = [];

const originUrls = ['https://pastebin.com/raw/5NHaxyGR',
'http://我不是.肥猫.love:63/接口禁止贩卖',
'http://cdn.yydsys.top/duo',
'http://xn--t75a.eu.org/tv',
'https://神器每日推送.tk/pz.json',
'https://agit.ai/Yoursmile7/tvbox/raw/branch/master/XC.json',
'https://tvbox.cainisi.cf',
'https://download.kstore.space/download/2883/m3u8/dsj/guochan/mp1/1.m3u8',
'http://9xi4o.tk/0725.json',
'http://52bsj.vip:81/api/v3/file/get/29899/box2.json?sign=3cVyKZQr3lFAwdB3HK-A7h33e0MnmG6lLB9oWlvSNnM%3D%3A0',
'http://pandown.pro/tvbox/tvbox.json',
'http://52bsj.vip:98/wuai',
'http://8.210.232.168/xc.json',
'https://freed.yuanhsing.cf/TVBox/meowcf.json',
'http://rihou.cc:88/荷城茶秀',
'https://freed.yuanhsing.cf/TVBox/meowcf.json',
'https://pastebin.com/raw/gtbKvnE1'
];

originUrls.forEach(url => fetch(url).then(res => {
    debugger;
    urls.push(url);
}));