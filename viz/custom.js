if (typeof console === 'undefined') {
  console = { log: function() { } };
}

function emojiFor(category) {
  var ems =  {
    'Water': '💧',
    'Solid waste': '🚮',
    'Cemetery': '💀',
    'Library': '📚',
    'Street Lighting': '💡',
    'Mother and Child Care': '🚼',
    'Roads': '🚧',
    'Sewerage': '💩',
    'Parks': '🌳',
    'Playgrounds': '🏏⚽'
  };
  return ems[category];
}

function init() {
  var maleColor = 'rgb(143, 169, 218)';
  var femaleColor = 'rgb(209, 132, 145)';

  var genderChart = c3.generate({
    bindto: '#gender-chart',
    data: {
      columns: [
        ['Male', 44],
        ['Female', 56]
      ],
      colors: {
        'Male': maleColor,
        'Female': femaleColor
      },
      type : 'pie'
      //,
      //onclick: function (d, i) { console.log("onclick", d, i); },
      //onmouseover: function (d, i) { console.log("onmouseover", d, i); },
      //onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    }
  });

  var sampieChart = c3.generate({
    bindto: '#sampie-chart',
    data: {
      columns: [
        ['Samurdhi', 6.4],
        ['Other', 93.6]
      ],
      type : 'pie'
    }
  });

  var ethnicityChart = c3.generate({
    bindto: '#ethnicity-chart',
    data: {
      columns: [
        ['Sinhala', 71],
        ['Tamil', 11.9],
        ['Moor', 15.4],
        ['Other', 1.7]
      ],
      type: 'pie'
    }
  });

  function makeGauge(divid, satisfaction) {
    return c3.generate({
      bindto: divid,
      data: {
        columns: [
          ['Satisfaction', satisfaction]
        ],
        type: 'gauge'
      },
      gauge: {
      },
      color: {
        pattern: ['#FF0000', '#F6C600', '#60B044'],
        threshold: {
          values: [40, 60, 100]
        }
      },
      size: {
        height: 180
      }
    });
  }

  var overall = makeGauge('#overall-chart', 47);
  var m = makeGauge('#male-gauge', 30);
  var f = makeGauge('#female-gauge', 50);
  var sg = makeGauge('#sam-gauge', 70);
  var shg = makeGauge('#sinhala-gauge', 49);
  var tmg = makeGauge('#tamil-gauge', 37);
  var mog = makeGauge('#moor-gauge', 43);
  var otg = makeGauge('#other-gauge', 36);

  function makeChart(divid, categories, groups) {

    var cols = Object.keys(categories);
    cols = cols.sort(function(a, b) {
      return categories[b][0] - categories[a][0];
    });
    var high = [groups[0]];
    var medium = [groups[1]];
    var low = null;
    var dunno = null;
    if (groups.length > 2) {
      low = [groups[2]];
    }
    if (groups.length > 3) {
      dunno = [groups[3]];
    }
    for (var c = 0; c < cols.length; c++) {
      high.push(categories[cols[c]][0]);
      medium.push(categories[cols[c]][1]);
      if (low) {
        low.push(categories[cols[c]][2]);
      }
      if (dunno) {
        dunno.push(categories[cols[c]][3]);
      }
    }

    var colors = {};
    colors[groups[0]] = 'rgb(23, 157, 57)';
    colors[groups[1]] = 'rgb(245, 170, 0)';
    if (low) {
      colors[groups[2]] = 'rgb(126, 40, 40)';
    }
    if (dunno) {
      colors[groups[3]] = '#ccc';
    }

    var dataset = [high, medium];
    if (low) {
      dataset.push(low);
    }
    if (dunno) {
      dataset.push(dunno);
    }

    var groupMaker = [];
    if (groups[0] === 'High' || groups[0] === 'Available, Using') {
      groupMaker = [groups];
    }

    var rotate = 0;
    if ($(window).width() < 767) {
      rotate = 75;
    }

    return c3.generate({
      bindto: divid,
      data: {
        columns: dataset,
        type: 'bar',
        colors: colors,
        groups: groupMaker,
        order: 'asc'
      },
      axis: {
        x: {
          tick: {
            rotate: rotate,
            format: function (n) {
              return cols[n];
            },
            culling: false
          }
        },
        y: {
          tick: {
            format: function(d) { if(d <= 100) { return Math.floor(d) + '%' } }
          }
        }
      }
    });
  }

  var satisfactions = {
    'Water': [75, 13, 3, 8],
    'Sewerage': [40, 29, 17, 13],
    'Solid waste': [63, 24, 6, 7],
    'Roads': [43, 31, 19, 7],
    'Street Lighting': [49, 30, 14, 8],
    'Mother and Child Care': [45, 30, 10, 16],
    'Cemetery': [54, 28, 7, 11],
    'Parks': [39, 38, 16, 7],
    'Playgrounds': [38, 39, 18, 5],
    'Library': [54, 34, 9, 4]
  };
  var satChart = makeChart('#sat-chart', satisfactions, ['High', 'Medium', 'Low', 'Don\'t Know']);

  var samsat = {
    'Water': [85, 75],
    'Sewerage': [54, 39],
    'Solid waste': [70, 62],
    'Roads': [43, 42],
    'Street Lighting': [55, 48],
    'Mother and Child Care': [57, 43],
    'Cemetery': [80, 53],
    'Parks': [52, 38],
    'Playgrounds': [49, 37],
    'Library': [59, 53]
  };

  var samChart = makeChart('#sam-chart', samsat, ['Samurdhi', 'Others']);

  var distances = {
    'Water': [6, 69, 0],
    'Sewerage': [56, 33, 36],
    'Solid waste': [76, 57, 52],
    'Roads': [57, 35, 35],
    'Street Lighting': [67, 40, 40],
    'Mother and Child Care': [65, 36, 32],
    'Cemetery': [74, 42, 53],
    'Parks': [60, 30, 38],
    'Playgrounds': [56, 28, 45],
    'Library': [76, 42, 48]
  };
  var distChart = makeChart('#dist-chart', distances, ['Very Close', 'Moderate', 'Far Away']);

  var availability = {
    'Water': [96, 4, 0],
    'Sewerage': [74, 17, 10],
    'Solid waste': [98, 2, 1],
    'Roads': [90, 6, 4],
    'Street Lighting': [90, 3, 6],
    'Mother and Child Care': [49, 48, 4],
    'Cemetery': [67, 28, 5],
    'Parks': [32, 44, 24],
    'Playgrounds': [26, 57, 17],
    'Library': [32, 49, 19]
  };
  var availChart = makeChart('#avail-chart', availability, ['Available, Using', 'Available, Not Using', 'Not Available']);

  // population pyramid via http://jsbin.com/jalex/1/edit?css,js,output
  var w = $("#middlecontainer").width() * 0.8;
  if ($(window).width() > 700) {
    w *= 0.2;
  }
  var h = 280;

  // margin.middle is distance from center line to each y-axis
  var margin = {
    top: 20,
    right: 20,
    bottom: 24,
    left: 20,
    middle: 28
  };

  // the width of each side of the chart
  var regionWidth = w/2 - margin.middle;

  // these are the x-coordinates of the y-axes
  var pointA = regionWidth,
      pointB = w - regionWidth;

  // some contrived data
  var exampleData = [
    {group: '18-30', male: 7, female: 7},
    {group: '31-45', male: 32, female: 39},
    {group: '46-60', male: 34, female: 34},
    {group: '> 60', male: 26, female: 19}
  ];

  var totalPopulation = d3.sum(exampleData, function(d) { return d.male + d.female; }),
      percentage = function(d) { return d / totalPopulation; };

  var svg = d3.select('#pop-pyramid').append('svg')
    .attr('width', margin.left + (w * 1.2) + margin.right)
    .attr('height', margin.top + h + margin.bottom)
    .append('g')
      .attr('transform', translation(margin.left, margin.top));

  var maxValue = Math.max(
    d3.max(exampleData, function(d) { return percentage(d.male); }),
    d3.max(exampleData, function(d) { return percentage(d.female); })
  );

  var xScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, regionWidth])
    .nice();

  var xScaleLeft = d3.scale.linear()
    .domain([0, maxValue])
    .range([regionWidth, 0]);

  var xScaleRight = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, regionWidth]);

  var yScale = d3.scale.ordinal()
    .domain(exampleData.map(function(d) { return d.group; }))
    .rangeRoundBands([h,0], 0.1);

  var yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4,0)
    .tickPadding(margin.middle-4);

  var yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4,0)
    .tickFormat('');

  var xAxisRight = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d3.format('%'))
    .tickValues([0, 0.1, 0.2]);

  var xAxisLeft = d3.svg.axis()
    .scale(xScale.copy().range([pointA, 0]))
    .orient('bottom')
    .tickFormat(d3.format('%'))
    .tickValues([0, 0.1, 0.2]);

  var leftBarGroup = svg.append('g')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
  var rightBarGroup = svg.append('g')
    .attr('transform', translation(pointB, 0));

  svg.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle');

  svg.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight);

  svg.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, h))
    .call(xAxisLeft);

  svg.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(pointB, h))
    .call(xAxisRight);

  var mbars = leftBarGroup.selectAll('.bar.left')
    .data(exampleData)
    .enter().append('g');

  mbars.append('rect')
      .attr('class', 'bar left')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(percentage(d.male)); })
      .attr('height', yScale.rangeBand())
      .attr('fill', maleColor);

  mbars.append('text')
      .text(function(d) { return d.male + '%' })
      .attr('transform', 'scale(-1,1)')
      .attr('x', function(d) { return -1 * xScale(percentage(d.male)) - 25; })
      .attr('y', function(d) { return yScale(d.group) + 36; });

  var fbars = rightBarGroup.selectAll('.bar.right')
    .data(exampleData)
    .enter().append('g');

  fbars.append('rect')
      .attr('class', 'bar right')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(percentage(d.female)); })
      .attr('height', yScale.rangeBand())
      .attr('fill', femaleColor);

  fbars.append('text')
      .text(function(d) { return d.female + '%' })
      .attr('x', function(d) { return xScale(percentage(d.female)) + 5; })
      .attr('y', function(d) { return yScale(d.group) + 36; });

  function translation(x,y) {
    return 'translate(' + x + ',' + y + ')';
  }
}

$(init);
