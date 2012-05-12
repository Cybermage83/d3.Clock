$(document).ready(function(){

(function(){
    var width = 600, height = 600;


    //////////
    //default data for acs angles start
    /////////
    var masterClock = (function(){
        return[{
            seconds:0.12188215943093735,
            minutes:0.1,
            hours:0.1,
            days:0.1,
            months:0.1
        }];
    })();

    //svg elemets CLOCK main
    var clockObj = d3.select('#GFX').append('svg').attr('class','clockObj')
        .attr('width',width).attr('height',height)
        .style('border','1px solid rgba(111,111,111,0.5)').style('background','#322244');

    var newDate = new Date(),
        seconds = newDate.getSeconds(),
        minutes = newDate.getMinutes(),
        hours   = newDate.getHours(),
        days    = newDate.getDate(),
        month   = newDate.getMonth()+1;

    ///////////////////////////////
    //Setting up a basic Text Clock and setting main Group Eled3ments
    ///////////////////////////////
    var watch = clockObj.append('g').attr('transform','translate('+width/2.2+',0)').attr('class','clock').style('font-size','26px').style('fill','rgba(255,255,255,.8)'),
        circlesG = clockObj.append('g').attr('class','circlesG').attr('transform','translate('+width/2 +','+height/2+')'),
        centerObj = clockObj.append('g').attr('transform','translate('+width/2 +','+height/2+')');
    console.log('what is watch type', typeof  watch);

    var random   = parseInt(Math.random() * 360),
        colorSec =   d3.scale.linear().domain([0,60]).range([30,100]),//for coloring seconds
        watchH   = watch.append('text').attr('x',-60).attr('y',40).text(hours+':').transition().duration(2000).style('fill','hsl(121,100%,72%)'),
        watchM   = watch.append('text').attr('x',-25).attr('y',40).text(minutes+':').transition().duration(2000).style('fill','hsl(348, 100%, 50%)'),
        watchS   = watch.append('text').attr('x',10).attr('y',40).text(seconds+' -').transition().duration(2000).style('fill','hsl('+random+','+colorSec(seconds)+'%,'+colorSec(seconds)+'%)'),
        watchD   = watch.append('text').attr('x',60).attr('y',40).text(days+' / ').transition().duration(2000).style('fill','hsl(53,100%,51%)'),
        watchMt  = watch.append('text').attr('x',110).attr('y',40).text(' '+month).transition().duration(2000).style('fill','hsl(199,96%,62%)');

    ////////////////////////////////////////////////////
    //Used for Angle Calculation func = angleCalculation and Setting Arcs to circle
    ///////////////////////////////////////////////////
    var minSec     = d3.scale.linear().domain([0,60]).range([1,360]),
        cicle      = d3.scale.linear().domain([0,60]).range([0,360]),
        hourScale  = d3.scale.linear().domain([0,23]).range([1,360]),
        cicleH     = d3.scale.linear().domain([0,24]).range([0,360]),
        daysScale  = d3.scale.linear().domain([1,31]).range([11.612,360]),
        cicleD     = d3.scale.linear().domain([0,30]).range([0,360]),
        monthScale = d3.scale.linear().domain([1,12]).range([30,360]),
        circleM    = d3.scale.linear().domain([0,12]).range([0,360]);

    var pi180 = Math.PI/180,//radian and set up arcs
        arcS  = d3.svg.arc().innerRadius([180]).outerRadius([200]).startAngle(0).endAngle(function(d){/*console.log('d.seconds', d.seconds); */return d.seconds * pi180;}),
        arcM  = d3.svg.arc().innerRadius([150]).outerRadius([170]).startAngle(0).endAngle(function(d){return d.minutes * pi180;}),
        arcH  = d3.svg.arc().innerRadius([120]).outerRadius([140]).startAngle(0).endAngle(function(d){return d.hours * pi180;}),
        arcD  = d3.svg.arc().innerRadius([90]).outerRadius([110]).startAngle(0).endAngle(function(d){return d.days * pi180;}),
        arcMt = d3.svg.arc().innerRadius([60]).outerRadius([80]).startAngle(0).endAngle(function(d){return d.months * pi180;});

    console.log('minSec',minSec(1) * pi180);

    var theSecond = centerObj.data(masterClock).append('path').style('fill','hsl('+random+',30%,30%)').attr('class','seconds').attr('d',arcS),
        theMin    = centerObj.data(masterClock).append('path').style('fill','hsl(348, 100%, 50%)').attr('d',arcM).attr('class','minuteså'),
        theHour   = centerObj.data(masterClock).append('path').style('fill','hsl(121,100%,72%)').attr('d',arcH).attr('class','hours'),
        theDay    = centerObj.data(masterClock).append('path').style('fill','hsl(53,100%,51%)').attr('d',arcD).attr('class','days'),
        theMon    = centerObj.data(masterClock).append('path').style('fill','hsl(199,96%,62%)').attr('d',arcMt).attr('class','months');

    angleCalculation();  //uses timer scale for further calculation

    //////////////////////////////////////////////
    //Seting up Circles as anchors on the clock
    /////////////////////////////////////////////

    for(var d = 0; d< 60; d+=1){
        var x = cicle(d) * pi180;
        circlesG.append('circle').attr('cx',(190 * Math.cos(x))).attr('cy',(190 * Math.sin(x))).attr('r',2).style('fill','red').attr('class','secondsC');
        circlesG.append('circle').attr('cx',(160 * Math.cos(x))).attr('cy',(160 * Math.sin(x))).attr('r',2).style('fill','red').attr('class','circlesM');
    }
    for(d = 0; d< 24; d+=1){
        x = cicleH(d) * pi180;
        circlesG.append('circle').attr('cx',(130 * Math.cos(x))).attr('cy',(130 * Math.sin(x))).attr('r',2).style('fill','red').attr('class','circlesH');
    }
    for(d = 0; d< 31; d+=1){
        x = cicleD(d) * pi180;
        circlesG.append('circle').attr('cx',(100 * Math.cos(x))).attr('cy',(100 * Math.sin(x))).attr('r',2).style('fill','red').attr('class','circlesD');
    }
    for(d = 0; d< 12; d+=1){
        x = circleM(d) * pi180;
        circlesG.append('circle').attr('cx',(70 * Math.cos(x))).attr('cy',(70 * Math.sin(x))).attr('r',2).style('fill','red').attr('class','circlesD');
    }

    ////////////////////////////////////////////////////
    //to preload a nice clock effect from 0 to whatever
    ///////////////////////////////////////////////////
    var lenS  =  masterClock[0].seconds, incS  = masterClock[0].seconds/lenS, totalS  = 0,stateS = false,
        lenM  =  masterClock[0].minutes, incM  = masterClock[0].minutes/lenM, totalM  = 0,stateM = false,
        lenH  =  masterClock[0].hours,   incH  = masterClock[0].hours/lenH,   totalH  = 0,stateH = false,
        lenD  =  masterClock[0].days,    incD  = masterClock[0].days/lenD,    totalD  = 0,stateD = false,
        lenMt =  masterClock[0].months,  incMt = masterClock[0].months/lenMt, totalMt = 0,stateMt = false,
        animeStart = false;

    var secIn = setInterval(function(){
        totalS+= incS;
        masterClock[0].seconds = totalS;

        totalM+= incM;
        masterClock[0].minutes = totalM;

        totalH+= incH;
        masterClock[0].hours = totalH;

        totalD+= incD;
        masterClock[0].days = totalD;

        totalMt+= incMt;
        masterClock[0].months = totalMt;

        if(totalS <= lenS){
            theSecond.transition().ease('linear').duration(1).attr('d',arcS);
        }else{stateS = true;}

        if(totalM <= lenM){
            theMin.transition().ease('linear').duration(1).attr('d',arcM);
        }else{stateM = true;}

        if(totalH <= lenH){
            theHour.transition().ease('linear').duration(1).attr('d',arcH);
        }else{stateH = true;}

        if(totalD <= lenD){
            theDay.transition().ease('linear').duration(1).attr('d',arcD);
        }else{stateD = true;}

        if(totalMt <= lenMt){
            theMon.transition().ease('linear').duration(1).attr('d',arcMt);
        }else{stateMt = true;}

        if(stateS && stateM && stateH && stateD && stateMt){animeStart = true;  clearInterval(secIn); intercalit(); return false;}

    },1);

    console.log('masterClick',masterClock);

    //////////////////////////////////////////////////////////////////////////
    //Calculating Angles via external functions and checking for minute change
    //////////////////////////////////////////////////////////////////////////
    function angleCalculation(){

        var newDate = new Date();

        var seconds = newDate.getSeconds(),
            minutesL = newDate.getMinutes(),
            hours   = newDate.getHours(),
            days    = newDate.getDate(),
            month   = newDate.getMonth()+1;
        console.log('minL',minutesL,'minutes',minutes);

        if(minutesL !== minutes){random = parseInt(Math.random() * 360); minutes = minutesL;}

        masterClock[0].seconds     = minSec(seconds);
        masterClock[0].minutes = minSec(minutesL);
        masterClock[0].hours   = hourScale(hours);
        masterClock[0].days    = daysScale(days);
        masterClock[0].months  = monthScale(month);

        watchS.transition().duration(500).style('fill','hsl('+random+','+colorSec(seconds)+'%,'+colorSec(seconds)+'%)').text(seconds+' -');
        watchM.transition().text(minutesL+':');
        watchH.text(hours+':');
        watchD.text(days+' / ');
        watchMt.text(' '+month);

        return seconds;
    }
    ////////////////////////////////////
    //Animation Based on Time pet 1 sec
    ///////////////////////////////////
    function intercalit(){
        var timer = setInterval(function(){
            var sec = angleCalculation();
            //console.log('seconds problem',masterClock[0].seconds, masterClock[0].seconds * (Math.PI/180), 180 * (Math.PI/180) );

            theSecond.transition().duration(400).style('fill','hsl('+random+','+colorSec(sec)+'%,'+colorSec(sec)+'%)').transition().ease('elastic').duration(500).attr('d',arcS);
            theMin.transition().ease('elastic').duration(500).attr('d',arcM);
            theHour.transition().ease('elastic').duration(500).attr('d',arcH);
            theDay.transition().ease('elastic').duration(500).attr('d',arcD);
            theMon.transition().ease('elastic').duration(500).attr('d',arcMt);
        },1000);
    }
    /*
     function NativeAnimation(time){
     angleCalculation();
     //console.log('seconds problem',masterClock[0].seconds, masterClock[0].seconds * (Math.PI/180), 180 * (Math.PI/180) );
     //console.log('time',time);
     theSecond.transition().ease('elastic').duration(999).attr('d',arcS);
     theMin.transition().ease('elastic').duration(999).attr('d',arcM);
     theHour.transition().ease('elastic').duration(999).attr('d',arcH);
     theDay.transition().ease('elastic').duration(999).attr('d',arcD);
     theMon.transition().ease('elastic').duration(999).attr('d',arcMt);

     window.requestAnimationFrame(NativeAnimation);
     }

     (function() {
     var lastTime = 0;
     var vendors = ['ms', 'moz', 'webkit', 'o'];
     for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
     window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
     window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
     || window[vendors[x]+'CancelRequestAnimationFrame'];
     }

     if (!window.requestAnimationFrame)
     window.requestAnimationFrame = function(callback, element) {
     var currTime = new Date().getTime();
     var timeToCall = Math.max(0, 16 - (currTime - lastTime));
     //console.log('time tocall',timeToCall);
     var id = window.setTimeout(function() { callback(currTime + timeToCall); },
     timeToCall);
     lastTime = currTime + timeToCall;
     return id;
     };

     if (!window.cancelAnimationFrame)
     window.cancelAnimationFrame = function(id) {
     clearTimeout(id);
     };
     }());

     window.requestAnimationFrame(NativeAnimation);
     */

})();

});
