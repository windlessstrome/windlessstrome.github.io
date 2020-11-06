(function () {
	var win = nw.Window.get();
	win.show();
	$(document).ready(() => {
		$('#reload-button').on('click', function() {
			$('#reload-popup').hide();
			nw.App.clearCache();
			win.reload();
		})

		setTimeout(() => {
			if ($('.font-xm')[0]) {
				if ($('.font-xm')[0].textContent === "authportal.login.loadingHeaderText")
				$('st-window').hide();
			}
		}, 500);
	
		setInterval(async () => {
			try {
				let response = await fetch('https://www.mitel.com/', {
					method: 'HEAD',
					mode: 'no-cors',
					cache: 'no-cache'
				})
				console.log(`Network check passed: ${response}`);
				setTimeout(() => {
					if (!$('#a-profile')[0] && !$('.loading-indicator')[0]) {
						$('#reload-popup').css("display", "flex");
					}
				}, 7000)
			} catch(error) {
				console.log(`Network check failed: ${error}`);
				if ($('#a-profile')[0]) return;
				if ($('#spinner')[0]) {
					$('#spinner').hide();
				}
				if ($('st-window')[0]) {
					$('st-window').hide();
				}
				$('#network-status').show();
				$('#reload-popup').css("display", "flex");
				$('#reload-popup').addClass('popup-location');
			};
		}, 10000)
	})
})();
