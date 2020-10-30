(function () {
		setTimeout(function() {
			document.getElementById('reload-button').addEventListener('click', function() {
				document.getElementById('reload-popup').style.display = "none";
				nw.App.clearCache();
				win.reload();
			})
		}, 2000);
	
		setInterval(async () => {
			try {
				let response = await fetch('https://www.mitel.com/', {
					method: 'HEAD',
					mode: 'no-cors',
					cache: 'no-cache'
				})
				console.log(`Network check passed: ${response}`);
				document.getElementById('network-status').style.display = "none";
				setTimeout(function() {
					if (!document.getElementById('a-profile')) {
						document.getElementById('reload-popup').style.display = "flex";
					}
				}, 1000)
			} catch(error) {
				console.log(`Network check failed: ${error}`);
				if (document.getElementById('a-profile')) return;
				if (document.getElementById('spinner')) {
					document.getElementById('spinner').style.display = "none";
				}
				if (document.querySelector('st-window')) {
					document.getElementById('st-window').style.display = "none";
				}
				document.getElementById('network-status').style.display = "block";
			};
		}, 10000)
})();
