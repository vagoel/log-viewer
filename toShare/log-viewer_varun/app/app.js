var $firstTenBtn, $lastTenBtn, $nextTenBtn, $prevTenBtn, $userInput, $viewBtn, $logContainer;



$(function () {
	var log;
	$firstTenBtn = $('#first-10-btn');
	$lastTenBtn = $('#last-10-btn');
	$nextTenBtn = $('#next-10-btn');
	$prevTenBtn = $('#prev-10-btn');
	$userInput = $('#input-container input');
	$viewBtn = $('#input-container button');
	$logContainer = $('#log-container');

	$('[data-toggle="tooltip"]').tooltip();
	registerEventhandlers();
})

var utils = (function () {
	var logLines = [],
		startIndex;

	var setLogLines = function (lines) {
		logLines = lines;
	}

	var getLogLines = function () {
		return logLines;
	}

	var setStartIndex = function (index) {
		startIndex = index;
	}

	var getStartIndex = function () {
		return startIndex;
	}

	return {
		setLogLines: setLogLines,
		getLogLines: getLogLines,
		getStartIndex: getStartIndex,
		setStartIndex: setStartIndex
	}
})();

var registerEventhandlers = function () {
	$firstTenBtn.click(showFirstTenLines);
	$lastTenBtn.click(showLastTenLines);
	$nextTenBtn.click(showNextTenLines);
	$prevTenBtn.click(showPrevTenLines);
	$viewBtn.click(showFileContent);
}

var showFirstTenLines = function (event) {
	utils.setStartIndex(0);
	displayLines();
}

var showLastTenLines = function (event) {
	utils.setStartIndex(utils.getLogLines().length - 10 > 0 ? utils.getLogLines().length - 10 : 0);
	displayLines();
}

var showNextTenLines = function (event) {
	utils.setStartIndex(utils.getStartIndex() + 10 < utils.getLogLines().length ? utils.getStartIndex() + 10 : utils.getStartIndex());
	displayLines();
}

var fetchFileContent = function (filename) {
	return $.get('file/' + filename)
		.fail(function (error) {
			alert(error.responseText);
			return error;
		})
}

var showPrevTenLines = function (event) {
	utils.setStartIndex(utils.getStartIndex() - 10 <= 0 ? 0 : utils.getStartIndex() - 10);
	displayLines();
}

var displayLines = function () {
	var lines = utils.getLogLines();
	var startIndex = utils.getStartIndex();

	$logContainer.find('ul').empty().append(lines.slice(startIndex, startIndex + 10 > lines.length ? lines.length : startIndex + 10).join(''));
}

var showFileContent = function (event) {
	var filename = $userInput.val();
	$userInput.val('');
	if (filename) {
		fetchFileContent(filename)
			.done(function (records) {

				var lines = records.trim('').split(/\n/).map(function (record, index) {
					return '<li class="list-group-item"><div class="row"><div class="col-md-1 bg-info">' + (parseInt(index) + 1) + '</div><div class="col-md-11">' + record + '</div></li>';
				})
				utils.setLogLines(lines);
				utils.setStartIndex(0);
				$logContainer.find('span.help-block').text("Total Lines : " + lines.length + " , File Name : /server/log/" + filename);
				displayLines(0, lines);
			})
	}
	return;
}