(function () {
    const connectWebProdUrl = 'https://d38rd2h7f0l1wl.cloudfront.net';
    let fs = require('fs');
    let isMacOSX = nw.process.platform === 'darwin';
    let connectSettings = {};
    let pathConnectSettings = '';
    if (isMacOSX) {
        pathConnectSettings = '/Applications/connect.dev.setting.json';
    } else {
        pathConnectSettings = process.env.APPDATA + '\\connect.dev.setting.json';
    }

    if (fs.existsSync(pathConnectSettings)) {
        connectSettings = JSON.parse(fs.readFileSync(pathConnectSettings));
    } else {
        connectSettings.webUrl = connectWebProdUrl;
    }

    let base = document.createElement('base');
    base.setAttribute('href', connectSettings.webUrl);
    document.getElementsByTagName('head')[0].appendChild(base);
})();