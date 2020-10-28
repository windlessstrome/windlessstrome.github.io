(function () {
    let storedBuildVersion = localStorage.getItem('web-build-version') || '';
    setInterval(async () => {
        let url = "./web_build_version.txt?t=" + new Date().getTime();
        let response = await fetch(url);
        let fetchedBuildVersion = await response.text();
        if (fetchedBuildVersion !== storedBuildVersion) {
            localStorage.setItem('web-build-version', fetchedBuildVersion);
            nw.App.clearCache();
            win.reload();
        }
    }, 1000 * 60 * 60 * 5)
})();