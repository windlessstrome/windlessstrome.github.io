(function () {
	setTimeout(function () {
		$('#reload-button').on('click', function() {
			$('#reload-popup').css('display', 'none');
			nw.App.clearCache();
			win.reload();
		})
	}, 2000)

	setInterval(async () => {
		try {
			let response = await fetch('https://www.mitel.com/', {
				method: 'HEAD',
				mode: 'no-cors',
				cache: 'no-cache'
			})
			console.log(`Network check passed: ${response}`);
			$('#network-status').css('display', 'none');
			setTimeout(function() {
				if (!$('#a-profile')) {
					$('#reload-popup').css('display', 'flex');
				}
			}, 7000)
		} catch(error) {
			console.log(`Network check failed: ${error}`);
			if ($('#a-profile')) return;
			if ($('#spinner')) {
				$('#spinner').css('display', 'none');
			}
			$('#network-status').css('display', 'block');
		}
	}, 10000)
})();