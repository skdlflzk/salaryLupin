/**
*	SEE 월급일 기준(25일)으로 근무일 계산(일할 계산) 공휴일 고려되어있지 않음
*	
**/
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

/**
*	SEE 일 시작시간, 끝나는 시간, 점심시간, 휴식시간 고려해서 1ms 당 버는 금액계산.
*	TODO 전역변수만 남기고 setYearSal() 한번만 실행하는 편이 더 좋겠다
*	
**/

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
	calcTotalsSal()
})


/**
*	setYearSal() : Calculate  Salary/1ms and set it to global variable "msSal" 
**/
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

/**
*	setYearSal() : Set todayStart : Date with $('#start') InputText
**/
function setTodayStart(){
	y = parseInt($('#start').val())/100
	m = parseInt($('#start').val())%100
	todayStart.setHours(y)
	todayStart.setMinutes(m)
	todayStart.setSeconds(0)
	todayStart.setMilliseconds(0)
}


/**
*	calcTotalsSal() : 
*	1. Calculate today's total Salary until now 
*	2. Display it using updateSal()
*		2-1. if current time isn't on duty, then call [updateNotyet() | updateRest| updateBreak()] 
*	3. REPEAT it every 100ms. (0.1s)
**/
function calcTotalsSal(){
//	console.log(start)
//	console.log(Math.round(msSal * (Date.now() - start))+"원")

	starth =  parseInt($('#start').val())/100
	startm =  parseInt($('#start').val())%100
	endh =  parseInt($('#end').val())/100
	endm =  parseInt($('#end').val())%100
	fstarth = parseInt($('#fstart').val())/100
	fstartm = parseInt($('#fstart').val())%100
	fendh = parseInt($('#fend').val())/100
	fendm = parseInt($('#fend').val())%100

	s =  getTimeOf(starth,startm)
	e =  getTimeOf(endh,endm)
	fs = getTimeOf(fstarth,fstartm)
	fe = getTimeOf(fendh,fendm)
	if ( Date.now() < s){
		updateNotyet()
	}else if (e < Date.now()){
		updateRest(dSal)
	}else if (fs <= Date.now() && Date.now() < fe){
		updateBreak(Math.round(msSal * (fs - todayStart.getTime())))
	}else{
		updateSal(Math.round(msSal * (Date.now() - todayStart.getTime())))
	}
	setTimeout(function(){calcTotalsSal()},  100);
}

function getTimeOf(hour,min){
	let t = new Date()
	t.setHours(hour)
	t.setMinutes(min)
	t.setSeconds(0)
	t.setMilliseconds(0)

	return t.getTime();
}


function updateRest(s){
	$(".result").text("퇴근하세요! " + s + String.fromCharCode(parseInt("20a9",16)))
}

function updateNotyet(s){
	$(".result").text("아직 출근 전입니다")
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

