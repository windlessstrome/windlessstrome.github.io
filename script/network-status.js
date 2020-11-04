(function () {
	var win = nw.Window.get();
	win.show();
	$(document).ready(function() {
		$('#reload-button').on('click', function() {
			$('#reload-popup').hide();
			nw.App.clearCache();
			win.reload();
		})

		if (document.querySelector('.font-xm')) {
			if (document.querySelector('.font-xm').textContent === "authportal.login.loadingHeaderText")
			$('st-window').hide();
		}
	
		setInterval(async () => {
			try {
				let response = await fetch('https://www.mitel.com/', {
					method: 'HEAD',
					mode: 'no-cors',
					cache: 'no-cache'
				})
				console.log(`Network check passed: ${response}`);
				setTimeout(function() {
					if (!document.getElementById('a-profile') && !document.querySelector('.loading-indicator')) {
						$('#reload-popup').css("display", "flex");
					}
				}, 7000)
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
				$('#reload-popup').css("display", "flex");
				$('#reload-popup').addClass('popup-location');
			};
		}, 10000)
	})
})();
