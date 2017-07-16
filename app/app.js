
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
		pageSize=10,
		pageNumber=1,
		totalRecords,
		filename;

	var setLogLines = function (lines) {
		logLines = lines;
	}

	var getLogLines = function () {
		return logLines;
	}

	var getPageSize=function(){
		return pageSize;
	}

	var getPageNumber=function(){
		return pageNumber;
	}

	var setPageNumber=function(number){
		pageNumber=number;
	}

	var setTotalRecords=function(length){
		totalRecords=length;
	}

	var getTotalRecords=function(){
		return totalRecords;
	}

	var getFileName=function(){
		return filename;
	}

	var setFileName=function(name){
		filename=name;
	}

	var reset=function(){
		setLogLines([]);
		setPageNumber(1);
	}
	return {
		setLogLines: setLogLines,
		getLogLines: getLogLines,
		getPageNumber:getPageNumber,
		getPageSize:getPageSize,
		setPageNumber:setPageNumber,
		setTotalRecords:setTotalRecords,
		getTotalRecords:getTotalRecords,
		getFileName:getFileName,
		setFileName:setFileName,
		reset:reset
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
	utils.setPageNumber(1);
	showFileContent();
}

var showLastTenLines = function (event) {
	utils.setPageNumber(Math.ceil(utils.getTotalRecords()/utils.getPageSize()));
	showFileContent();
}

var showNextTenLines = function (event) {
	var maxPageSize=Math.ceil(utils.getTotalRecords()/utils.getPageSize());
	utils.setPageNumber(utils.getPageNumber()+1>=maxPageSize?maxPageSize:utils.getPageNumber()+1);
	showFileContent();
}

var showPrevTenLines = function (event) {
	utils.setPageNumber(utils.getPageNumber()-1<=1?1:utils.getPageNumber()-1);
	showFileContent();
}

var fetchFileContent = function (filename,page,size) {
	return $.get('file/' + filename,{
		page:page,
		size:size
	})
		.fail(function (error) {
			alert(error.responseText);
			return error;
		})
}

var displayLines = function () {
	var lines = utils.getLogLines();
	$logContainer.find('ul').empty().append(lines.join(''));
}

var showFileContent = function (event) {
	if(event && $userInput.val()){
		utils.reset();
		utils.setFileName($userInput.val());
		$userInput.val('');
	}
	var filename = utils.getFileName();
	if (filename) {
		fetchFileContent(filename,utils.getPageNumber(),utils.getPageSize())
			.done(function (response) {

				var records=response.records;
				var totalRecords=response.meta.totalRecords;

				var lines = records.map(function (record, index) {
					return '<li class="list-group-item"><div class="row"><div class="col-md-1 bg-info">' + (parseInt(index) + 1+(utils.getPageNumber()-1)*utils.getPageSize()) + '</div><div class="col-md-11">' + record + '</div></li>';
				})
				utils.setLogLines(lines);
				utils.setTotalRecords(totalRecords);
				$logContainer.find('span.help-block').text("Total Lines : " + totalRecords + " , File Name : /server/log/" + filename);
				displayLines();
			})
	}
	return;
}
