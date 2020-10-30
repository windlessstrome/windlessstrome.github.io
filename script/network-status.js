(function () {
	$(document).ready(function() {
		$('#reload-button').on('click', function() {
			$('#reload-popup').hide();
			nw.App.clearCache();
			win.reload();
		})
	
		setInterval(async () => {
			try {
				let response = await fetch('https://www.mitel.com/', {
					method: 'HEAD',
					mode: 'no-cors',
					cache: 'no-cache'
				})
				console.log(`Network check passed: ${response}`);
				$('#network-status').hide();
				setTimeout(function() {
					if (!document.getElementById('a-profile')) {
						$('#reload-popup').css("display", "flex");
					}
				}, 1000)
			} catch(error) {
				console.log(`Network check failed: ${error}`);
				if (document.getElementById('a-profile')) return;
				if (document.getElementById('spinner')) {
					$('#spinner').hide();
				}
				if (document.querySelector('st-window')) {
					$('st-window').hide();
				}
				$('#network-status').show();
			};
		}, 10000)
	})
})();
