(function () {
	setTimeout(function () {
		document.getElementById('reload-button').addEventListener('click', function() {
			document.getElementById('reload-popup').style.display = 'none';
			nw.App.clearCache();
			win.reload();
		})
	}, 1000)

	setInterval(async () => {
		fetch('https://www.mitel.com/', {
			method: 'HEAD',
			mode: 'no-cors',
			cache: 'no-cache'
		})
		.then(response => {
			console.log(`Network check passed: ${response}`);
			document.getElementById('network-status').style.display = 'none';
			setTimeout(function() {
				if (!document.getElementById('a-profile')) {
					document.getElementById('reload-popup').style.display = 'flex';
				}
			}, 12000)
		})
		.catch(error => {
			console.log(`Network check failed: ${error}`);
			if (document.getElementById('a-profile')) return;
			if (document.getElementById('spinner')) {
				document.getElementById('spinner').style.display = 'none';
			}
			document.getElementById('network-status').style.display = 'block';
		});
	}, 15000)
})();