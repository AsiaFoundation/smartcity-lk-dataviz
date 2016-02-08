function init() {
  var maleColor = 'rgb(143, 169, 218)';
  var femaleColor = 'rgb(209, 132, 145)';

  var genderChart = c3.generate({
    bindto: '#gender-chart',
    data: {
        columns: [
            ['Male', 43],
            ['Female', 50],
            ['Unrecorded', 7] // added by me
        ],
        colors: {
          'Male': maleColor,
          'Female': femaleColor,
          'Unrecorded': 'rgb(255, 108, 80)'
        },
        type : 'pie'
        //,
        //onclick: function (d, i) { console.log("onclick", d, i); },
        //onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        //onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    }
  });

  var ethnicityChart = c3.generate({
    bindto: '#ethnicity-chart',
    data: {
      columns: [
        ['One', 16, 16, 16, 16],
        ['Multiple', 33, 21, 27, 20],
      ],
      type: 'bar',
      groups: [
          ['One', 'Multiple']
      ]
    },
    axis: {
      x: {
        tick: {
          format: function (n) {
            return ['Sinhala', 'Tamil', 'Moor', 'Other'][n];
          }
        }
      },
      y: {
        tick: {
          values: [0, 15, 30, 45, 60],
          format: function(d) { return Math.floor(d) + '%' }
        }
      }
    }
  });

  var satisfactions = {
    'Water': [75, 13, 3],
    'Sewerage': [40, 29, 17],
    'Solid waste': [63, 24, 6],
    'Roads': [43, 31, 19],
    'Street Lighting': [49, 30, 14],
    'Mother and Child Care': [45, 30, 10],
    'Cemetery': [54, 28, 7],
    'Parks': [39, 38, 16],
    'Playgrounds': [38, 39, 18],
    'Library': [54, 34, 9]
  };

  var cols = Object.keys(satisfactions);
  cols = cols.sort(function(a, b) {
    return satisfactions[b][0] - satisfactions[a][0];
  });
  var high = ['High'];
  var medium = ['Medium'];
  var low = ['Low'];
  for (var c = 0; c < cols.length; c++) {
    high.push(satisfactions[cols[c]][0]);
    medium.push(satisfactions[cols[c]][1]);
    low.push(satisfactions[cols[c]][2]);
  }

  var satChart = c3.generate({
    bindto: '#sat-chart',
    data: {
      columns: [high, medium, low],
      type: 'bar',
      colors: {
        'High': 'rgb(23, 157, 57)',
        'Medium': 'rgb(245, 170, 0)',
        'Low': 'rgb(126, 40, 40)'
      }
    },
    axis: {
      x: {
        tick: {
          format: function (n) {
            return cols[n];
          },
          culling: false
        }
      },
      y: {
        tick: {
          format: function(d) { return Math.floor(d) + '%' }
        }
      }
    }
  });

  // population pyramid via http://jsbin.com/jalex/1/edit?css,js,output
  var w = $("body").width() * 0.24, h = 280;

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
    .attr('width', margin.left + w + margin.right)
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

  leftBarGroup.selectAll('.bar.left')
    .data(exampleData)
    .enter().append('rect')
      .attr('class', 'bar left')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(percentage(d.male)); })
      .attr('height', yScale.rangeBand())
      .attr('fill', maleColor);

  rightBarGroup.selectAll('.bar.right')
    .data(exampleData)
    .enter().append('rect')
      .attr('class', 'bar right')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(percentage(d.female)); })
      .attr('height', yScale.rangeBand())
      .attr('fill', femaleColor);

  function translation(x,y) {
    return 'translate(' + x + ',' + y + ')';
  }
}

$(init);
