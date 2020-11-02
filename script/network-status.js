(function () {
	var win = nw.Window.get();
	win.show();
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
					if (!$('#a-profile')) {
						$('#reload-popup').css("display", "flex");
					}
				}, 7000)
			} catch(error) {
				console.log(`Network check failed: ${error}`);
				if ($('#a-profile')) return;
				if ($('#spinner')) {
					$('#spinner').hide();
				}
				if ($('st-window')) {
					$('st-window').hide();
				}
				$('#network-status').show();
				$('#reload-popup').css("display", "flex");
			};
		}, 10000)
	})
})();
