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
	var wh = parseInt($('#end').val())/100 - parseInt($('#start').val())/100 - parseInt($('#break').val())
//	console.log("wh =  "+ wh)
	hSal = dSal/wh
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
	updateSal(Math.round(msSal * (Date.now() - start)))
	setTimeout(function(){calcTotalsSal(start)},  100);
}

function updateSal(s){
	$(".result").text(locale(s) +" " + String.fromCharCode(parseInt("20a9",16)))
}

function locale(s){
	return Intl.NumberFormat().format(s)
}

