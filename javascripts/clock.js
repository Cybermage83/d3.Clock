/**
 * Created with JetBrains PhpStorm.
 * User: andrey
 * Date: 4/30/12
 * Time: 12:41 PM
 * To change this template use File | Settings | File Templates.
 */
console.log('is d3 present',d3);

var elm = $('#GFX'),svg = elm.find('svg');
elm.append('<p>SOMETHING HERE</p>');


var d = d3.select('#GFX')
    .selectAll('p')
    .data([20,50,60,70],function(d){console.log('d',d);})
    .enter().append('p').text(function(d){return 'Im number '+d+'!';}).transition().duration(50)
    .delay(function(d,i){console.log('i',i); return i * 1500;})
    .style('color',function(){
        return 'hsl('+Math.random() *360 +',100%,50%)';
    })
    ;


var nsvg = d3.select('#GFX').select('svg').attr('height',100).attr('width',100);
console.log('nsvg',nsvg);
nsvg.append('circle').attr('cx',50).attr('cy',50).attr('r',10);

var t = 1297110663, // start time (seconds since epoch)
    v = 70, // start value (subscribers)
    data = d3.range(33).map(next); // starting dataset

function next() {
    return {
        time: ++t,
        value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5)))
    };
}
           console.log('data',data);


var w = 20,h = 80;

var x = d3.scale.linear().domain([0,1]).range([0,w]);
var y = d3.scale.linear().domain([0,100]).rangeRound([0,h]);

var chart = d3.select('#GFX').append('svg');

setInterval(function(){
    data.shift();
    data.push(next());
    redraw();
    // console.log('data',data);
},3000);

chart.attr('class','chart').attr('width',w * data.length -1).attr('height',h);

chart.selectAll('rect').data(data).enter().append('rect')
    .attr('x',function(d,i){return x(i) - .5;})
    .attr('y',function(d,i){return h-y(d.value) -.5;})
    .attr('width',w)
    .attr('height',function(d){return y(d.value)});

chart.append('line')
    .attr('x1',0)
    .attr('x2',w*data.length)
    .attr('y1',h-.5)
    .attr('y2',h -.5)
    .style('stroke','#000');

function redraw(){
    var rect = chart.selectAll('rect').data(data,function(d){return d.time});
    //console.log('rext',rect);
    rect.enter().insert('rect','line')
        .attr('x',function(d,i){ return x(i+1)-.5;})
        .attr('y',function(d){return h-y(d.value) - .5})
        .attr('width',w)
        .attr('height',function(d){return y(d.value);});

    rect.transition().duration(1000).attr('x', function(d,i){/*console.log('xi',x(i),'i',i); */return x(i) -.5});

    rect.exit().transition().duration(1000).attr('x',function(d,i){return x(i-1) -.5;}).remove();
}

(function(){
    var w = 960,
        h = 500,
        y = d3.scale.ordinal().domain(d3.range(50)).rangePoints([20, h - 20]),
        t = Date.now();
    console.log('y is', y.domain(),'y',y,'t',t,'time',Date);
    var svg = d3.select("#GFX").append("svg")
        .attr("width", w)
        .attr("height", h).style('border','1px solid #333');

    var circle = svg.selectAll("circle")
        .data(y.domain())
        .enter().append("circle")
        .attr("r", 16)
        .attr("cx", 20)
        .attr("cy", y)
        .each(slide(20, w - 20));
    var time  = 500;
    function slide(x0, x1) {
      var to = 1000; time +=1000;

        //console.log('tooo',to);
      return function(d,i) {//console.log('what is D and I',d,i,' ',to * d - time);
        d3.select(this).transition()
            .duration((d+1) * 10000)
            .attr("cx", x1)
            .each("end", slide(x1, x0));
      };
    }
})();

(function(){
     var svg = d3.select('#GFX').append('svg').attr('width',100).attr('height',100).style('border','1px solid #222')
         .append('text').attr('x',10).attr('y',10).text('HELLO');
})();

(function(){
    var data = [{year: 2006, books: 54},
                {year: 2007, books: 43},
                {year: 2008, books: 41},
                {year: 2009, books: 44},
                {year: 2010, books: 35},
                {year: 2011, books: 15},
                {year: 2012, books: 10},
                {year: 2013, books: 25}];

    var barWidth = 40;
    var width = (barWidth + 10) * data.length;
    var height = 200;

    var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
    var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.books; })]).
      rangeRound([0, height-20]);
    var meY = d3.scale.linear().domain([0,d3.max(data, function(datum) { return datum.books; })]).rangeRound([height,0]);

    // add the canvas to the DOM
    var barDemo = d3.select("#GFX").
      append("svg:svg").
      attr("width", width+barWidth).
      attr("height", height).attr('class','basichart').style('padding-left','40px');



    barDemo.selectAll("rect").
      data(data).
      enter().
      append("svg:rect").
      attr("x", function(datum, index) { return x(index); }).
      attr("y", function(datum) {console.log('y_dantum',y(datum.books)); return height - (y(datum.books) +20); }).
      attr("height", function(datum) { return y(datum.books); }).
      attr("width", barWidth).
      attr("fill", "#2d578b");

    barDemo.selectAll('text').data(data).enter()
        .append('text')
        .attr('x',function(d,i){return x(i)})
        .attr('y',function(d){return height -(y(d.books)+17)})
        .attr('dx', barWidth/2)
        .attr('dy','12px')
        .attr('text-anchor','middle')
        .text(function(d){return d.books})
        .style('fill','white');

    barDemo.selectAll('text.xAxis').data(data).enter().append('text')
        .attr('x',function(d,i){return x(i)})
        .attr('y',function(d){return height-15})
        .attr('dx', 20)
        .attr('dy','12px')
        .attr('text-anchor','middle')
        .text(function(d){ return d.year; })
        .style('fill','red');

    var yAxis = d3.svg.axis();

        yAxis.scale(meY).orient('left').ticks(5);
        barDemo.append('g').attr('class','yAxy').attr('transform','translate('+-barWidth/5+')').call(yAxis);
})();

(function(){
    var width = 700, height = 525, padding = 50;

    var y = d3.time.scale().domain([new Date(2011,0,1),new Date(2011,0,1,23,59)]).range([0,height]),
        x = d3.time.scale().domain([new Date(2011,0,1),new Date(2011,11,31)]).range([0,width]),
        monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data = [
          {date: new Date(2011, 0, 1), sunrise: [7, 51], sunset: [16, 42]},
          {date: new Date(2011, 0, 15), sunrise: [7, 48], sunset: [16, 58]},
          {date: new Date(2011, 1, 1), sunrise: [7, 33], sunset: [17, 21]},
          {date: new Date(2011, 1, 15), sunrise: [7, 14], sunset: [17, 41]},
          {date: new Date(2011, 2, 1), sunrise: [6, 51], sunset: [18, 0]},
          {date: new Date(2011, 2, 5), sunrise: [6, 32], sunset: [18, 15]}, // dst - 1 day
          {date: new Date(2011, 2, 10), sunrise: [7, 30], sunset: [19, 16]}, // dst
          {date: new Date(2011, 2, 15), sunrise: [7, 28], sunset: [19, 18]}, // dst + 1 day
          {date: new Date(2011, 2, 20), sunrise: [7, 26], sunset: [19, 19]},
          {date: new Date(2011, 2, 30), sunrise: [7, 17], sunset: [19, 25]}, // equinox
          {date: new Date(2011, 3, 1), sunrise: [6, 54], sunset: [19, 41]},
          {date: new Date(2011, 3, 15), sunrise: [6, 29], sunset: [19, 58]},
          {date: new Date(2011, 4, 1), sunrise: [6, 3], sunset: [20, 18]},
          {date: new Date(2011, 4, 15), sunrise: [5, 44], sunset: [20, 35]},
          {date: new Date(2011, 5, 1), sunrise: [5, 30], sunset: [20, 52]},
          {date: new Date(2011, 5, 15), sunrise: [5, 26], sunset: [21, 1]},
          {date: new Date(2011, 5, 21), sunrise: [5, 26], sunset: [21, 3]}, // solstice
          {date: new Date(2011, 6, 1), sunrise: [5, 30], sunset: [21, 3]},
          {date: new Date(2011, 6, 15), sunrise: [5, 41], sunset: [20, 57]},
          {date: new Date(2011, 7, 1), sunrise: [5, 58], sunset: [20, 40]},
          {date: new Date(2011, 7, 15), sunrise: [6, 15], sunset: [20, 20]},
          {date: new Date(2011, 8, 1), sunrise: [6, 35], sunset: [19, 51]},
          {date: new Date(2011, 8, 15), sunrise: [6, 51], sunset: [19, 24]},
          {date: new Date(2011, 8, 23), sunrise: [7, 1], sunset: [19, 9]}, // equinox
          {date: new Date(2011, 9, 1), sunrise: [7, 11], sunset: [18, 54]},
          {date: new Date(2011, 9, 15), sunrise: [7, 28], sunset: [18, 29]},
          {date: new Date(2011, 10, 1), sunrise: [7, 51], sunset: [18, 2]},
          {date: new Date(2011, 10, 5), sunrise: [7, 57], sunset: [17, 56]}, // last day of dst
          {date: new Date(2011, 10, 6), sunrise: [6, 58], sunset: [16, 55]}, // standard time
          {date: new Date(2011, 10, 7), sunrise: [6, 59], sunset: [16, 54]}, // standard time + 1
          {date: new Date(2011, 10, 15), sunrise: [7, 10], sunset: [16, 44]},
          {date: new Date(2011, 11, 1), sunrise: [7, 31], sunset: [16, 33]},
          {date: new Date(2011, 11, 15), sunrise: [7, 44], sunset: [16, 32]},
          {date: new Date(2011, 11, 22), sunrise: [7, 49], sunset: [16, 35]}, // solstice
          {date: new Date(2011, 11, 31), sunrise: [7, 51], sunset: [16, 41]}
        ];

    var chartObj = d3.select('#GFX').append('svg')
        .attr('width',width + padding * 2)
        .attr('height',height + padding * 2).style('border','1px solid rgba(111,111,111,0.5)');

    var axisGroup = chartObj.append('g').attr('transform','translate('+padding+','+padding+')');

    function midMonth (){
        return d3.range(0,12).map(function(i){return d3.round(x(new Date(2011,i,15)))+.5});
    }

    axisGroup.selectAll('.yTicks').data(d3.range(5,22)).enter().append('line')
        .attr('x1',-5)
        .attr('y1',function(d){ return d3.round(y(new Date(2011,0,1,d)))+ 0.5; })
        .attr('x2',width+5)
        .attr('y2',function(d){return d3.round(y(new Date(2011,0,1,d)))+ 0.5; })
        .attr('stroke','lightgray')
        .attr('class','yTicks');

    axisGroup.selectAll('.xTicks').data(d3.range(0,12)).enter().append('line')
        .attr('x1',function(d){return d3.round(x(new Date(2011,d,15)))+.5;})
        .attr('y1',-5)
        .attr('x2',function(d){return d3.round(x(new Date(2011,d,15)))+.5;})
        .attr('y2',height+5)
        .attr('stroke','lightgray')
        .attr('class','xTicks');


    axisGroup.selectAll('.xTicksTop').data(midMonth).enter().append('text')
        .attr('x',function(d){ return d-padding/4;})
        .attr('y',-padding/1.2)
        .attr('dx',10)
        .attr('dy','14px')
        .attr('text-anchor','middle')
        .attr('class','xTicksTop')
        .text(function(d,i){return monthNames[i];})
        .style('fill','green');

    axisGroup.selectAll('.xTicksBottom').data(midMonth).enter().append('text')
        .attr('x',function(d){ return d-padding/4;})
        .attr('y',height + padding/4)
        .attr('dx',10)
        .attr('dy','14px')
        .attr('text-anchor','middle')
        .attr('class','xTicksBottom')
        .text(function(d,i){return monthNames[i];})
        .style('fill','green');

    axisGroup.selectAll('.yTicksLeft').data(d3.range(5,22)).enter().append('text')
        .attr('x',-padding/1.3)
        .attr('y',function(d){ return d3.round(y(new Date(2011,0,1,d)))- 4.0; })
        .attr('dx',10)
        .attr('dy','8px')
        .attr('text-anchor','middle')
        .attr('class','yTicksLeft')
        .text(function(d){ return d+':00';})
        .style('fill','green')
        .style('font-size','10px');

    axisGroup.selectAll('.yTicksRight').data(d3.range(5,22)).enter().append('text')
        .attr('x',width+padding/3)
        .attr('y',function(d){ return d3.round(y(new Date(2011,0,1,d)))- 4.0; })
        .attr('dx',10)
        .attr('dy','8px')
        .attr('text-anchor','middle')
        .attr('class','yTicksRight')
        .text(function(d){ return d+':00';})
        .style('fill','green')
        .style('font-size','10px');

    //--graphing

    var lineObj = chartObj.append('g').attr('transform','translate('+padding+','+padding+')');

    lineObj.append('rect').attr('x',0).attr('y',0).attr('height',height).attr('width',width).attr('fill','lightyellow');

    var sunriseLine = d3.svg.area()
        .x(function(d){return x(d.date);})
        .y1(function(d){return y(new Date(2011, 0 , 1, d.sunrise[0], d.sunrise[1]))})
        .interpolate('linear');

    lineObj.append('path').attr('d',sunriseLine(data)).attr('fill','steelblue');

    var sunsetArea = d3.svg.area()
            .x(function(d){return x(d.date);})
            .y0(height)
            .y1(function(d){return y(new Date(2011, 0 , 1, d.sunset[0], d.sunset[1]))})
            .interpolate('linear');

    lineObj.append('path').attr('d',sunsetArea(data)).attr('fill','steelblue');

    var lineBreaker = chartObj.append('g').attr('transform','translate('+padding+','+padding+')');

    lineBreaker.append('line')
        .attr('x1',0)
        .attr('y1',function(d){return d3.round(y(new Date(2011,0,1,12)))+.5;})
        .attr('x2',width)
        .attr('y2',function(d){return d3.round(y(new Date(2011,0,1,12)))+.5;})
        .style('stroke','#ccc')
        .attr('class','lineBreaker');
})();

(function(){
    var width = 600, height = 600,//for future use vars
        padding = 20, rInner = Math.min(w, h) / 1.8, rOutter = Math.max(w, h) / 1.8;

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
    //Setting up a basic Text Clock and setting main Group Elements
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
        watchM.text(minutesL+':');
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