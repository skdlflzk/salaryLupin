let t = new Date()
let today = t.getDate()

wd = 0
let oneDay = 1000*60*60*24
if (today  <= 25){ //월급 전
	prev = new Date()
	prev.setMonth(prev.getMonth()-1)
	prev.setDate(26)
	future = new Date()
	future.setDate(25)
	future.setHours(23)
	for (var  i = prev.getTime() ; i < future.getTime(); i += oneDay){
		day = new Date(i).getDay()
		if( 1 <= day && day <= 5){
			wd += 1
		}
	}
}else{ //월급 후
	prev = new Date()
	prev.setDate(26)
	prev.setHours(0)

	future = new Date()
	future.setMonth(future.getMonth() + 1)
	future.setDate(25)
	future.setHours(23)
	for (var  i = prev.getTime() ; i < future.getTime(); i += oneDay){
		day = new Date(i).getDay()
		if( 1 <= day && day <= 5){
			wd += 1
		}
	}
}

var ySal =  parseInt($('#ySal').val());
if ($('#probation').is(':checked') == true) ySal = ySal * 0.8
else if ($('#probation').is(':checked') == false) ySal = parseInt($('#ySal').val())
//console.log('1'+ySal * 0.5)
var mSal = ySal/12
var dSal = mSal/wd
//console.log("일급" +dSal)
var wh = parseInt($('#end').val())/100 - parseInt($('#start').val())/100 -  parseInt($('#break').val())
var hSal = dSal/wh
var sSal = hSal/(3600)
var msSal = sSal/1000
//console.log("초급" + sSal)

var todayStart = new Date()

$(document).ready(function(){
	(function() {
	    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	    link.type = 'image/x-icon';
	    link.rel = 'shortcut icon';
	    link.href = 'favicon.ico';
	    document.getElementsByTagName('head')[0].appendChild(link);
	})();
	$('#ySal').change(function(){
		setYearSal()
	})
	
	$('#start').change(function(){
		setTodayStart()
	})
	
	$('#end').change(function(){
		setTodayStart()
	})
	
	$('#break').change(function(){
		setYearSal()
	})
	$('#fstart').change(function(){
		setYearSal()
	})
	$('#fend').change(function(){
		setYearSal()
	})
	$('#probation').change(function(){
		setYearSal()
	})
	setYearSal()
	setTodayStart()
	calcTotalsSal(todayStart.getTime())
})
function setYearSal(){
	var ySal =  parseInt($('#ySal').val())
	if ($('#probation').is(':checked') == true) ySal = ySal * 0.8
	else if ($('#probation').is(':checked') == false) ySal = parseInt($('#ySal').val())
//console.log('1'+ySal * 0.5)
	mSal = ySal/12
	dSal = mSal/wd
	//console.log("일급" +dSal)

	var wh = parseInt($('#end').val()) - parseInt($('#start').val()) - parseInt($('#break').val())*100 - (parseInt($('#fend').val()) - parseInt($('#fstart').val()))

	console.log("근로시간 wh =  "+ wh/100)
	hSal = dSal/(wh/100)
	sSal = hSal/(3600)
	msSal = sSal/1000
}
function setTodayStart(){
	y = parseInt($('#start').val())/100
	m =  parseInt($('#start').val())%100
	todayStart.setHours(y)
	todayStart.setMinutes(m)
	todayStart.setSeconds(0)
	todayStart.setMilliseconds(0)
}

function calcTotalsSal(start){
//	console.log(start)
//	console.log(Math.round(msSal * (Date.now() - start))+"원")

	fstarth = parseInt($('#fstart').val())/100
	fstartm = parseInt($('#fstart').val())%100
	fendh = parseInt($('#fend').val())/100
	fendm = parseInt($('#fend').val())%100

	fs = getTimeOf(fstarth,fstartm)
	fe = getTimeOf(fendh,fendm)
	if (fs <= Date.now() && Date.now() < fe){
		updateBreak(Math.round(msSal * (fs - start)))
	}else{
		updateSal(Math.round(msSal * (Date.now() - start)))
	}
	setTimeout(function(){calcTotalsSal(start)},  100);
}

function getTimeOf(hour,min){
	let t = new Date()
	t.setHours(hour)
	t.setMinutes(min)
	t.setSeconds(0)
	t.setMilliseconds(0)

	return t.getTime();
}

function updateSal(s){
	$(".result").text(locale(s) +" " + String.fromCharCode(parseInt("20a9",16)))
}

function updateBreak(s){
	$(".result").text("현재 점심시간입니다.<br> 오전 근무까지 번 돈 : " + locale(s) +" " + String.fromCharCode(parseInt("20a9",16)))
}

function locale(s){
	return Intl.NumberFormat().format(s)
}

