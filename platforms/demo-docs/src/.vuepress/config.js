module.exports = {
    title: 'Demo-Docs',
    themeConfig: {
        logo: '/favicon.png',
        nav: [
            { 
                text: '目录一', ariaLabel: '子目录', 
                items: [
                    { text: '子目录一', link: '/huyu' }
                ],
            },
        ],
        sidebar: [
            {
                title: '目录1',   // 必要的
                children: [ '/backend/App' ]
            },
        ]
    },
    markdown: {
        lineNumbers: true,
    },
}