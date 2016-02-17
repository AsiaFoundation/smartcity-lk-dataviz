if (typeof console === 'undefined') {
  console = { log: function() { } };
}

function init() {
  var maleColor = 'rgb(143, 169, 218)';
  var femaleColor = 'rgb(209, 132, 145)';

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

  function makeChart(divid, categories, groups, years) {
    var cols = Object.keys(categories);
    cols = cols.sort();

    var sample = categories[cols[0]];
    var multiyear = false;
    if (years && years.length) {
      multiyear = true;
    } else {
      years = [''];
    }

    var groupMaker = [];
    var dataset = [];
    var colors = {};

    for (var y = 0; y < years.length; y++) {
      var ngroups = groups.concat([]);
      if (groups[0] === 'High' || groups[0] === 'Available, Using') {
        if (multiyear) {
          for (var g = 0; g < ngroups.length; g++) {
            ngroups[g] = ngroups[g] + ' (' + years[y] + ')';
          }
        }
        groupMaker.push(ngroups);
      }

      var high = [ngroups[0]];
      var medium = [ngroups[1]];
      var low = null;
      var dunno = null;
      if (groups.length > 2) {
        low = [ngroups[2]];
      }
      if (groups.length > 3) {
        dunno = [ngroups[3]];
      }

      for (var c = 0; c < cols.length; c++) {
        var yearset = categories[cols[c]];
        high.push(yearset[y][0]);
        medium.push(yearset[y][1]);
        if (low) {
          low.push(yearset[y][2]);
        }
        if (dunno) {
          dunno.push(yearset[y][3]);
        }
      }

      colors[ngroups[0]] = 'rgb(23, 157, 57)';
      colors[ngroups[1]] = 'rgb(245, 170, 0)';
      if (low) {
        colors[ngroups[2]] = 'rgb(126, 40, 40)';
      }
      if (dunno) {
        colors[ngroups[3]] = '#ccc';
      }

      dataset.push(high);
      dataset.push(medium);
      if (low) {
        dataset.push(low);
      }
      if (dunno) {
        dataset.push(dunno);
      }
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
        order: function(x, y) {
          var bars = ['don\'t know', 'high', 'medium', 'low', 'available, using', 'available, not', 'not available'];
          bars.reverse();
          for (var b = 0; b < bars.length; b++) {
            if (x.id.toLowerCase().indexOf(bars[b]) > -1) {
              return -1;
            } else if (y.id.toLowerCase().indexOf(bars[b]) > -1) {
              return 1;
            }
          }
        }
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
    'Sewerage': [[17, 21, 49, 13], [12, 33, 39, 16]],
    'Solid waste': [[39, 41, 19, 0], [58, 32, 9, 1]],
    'Roads': [[20, 29, 48, 3], [31, 37, 24, 8]],
    'Street Lighting': [[11, 25, 62, 2], [12, 20, 54, 14]],
    'Mother and Child Care': [[43, 45, 10, 3], [48, 45, 5, 2]],
    'Cemetery': [[12, 32, 50, 6], [22, 46, 20, 11]],
    'Parks': [[32, 38, 28, 3], [12, 54, 29, 6]],
    'Playgrounds': [[21, 46, 28, 5], [16, 50, 29, 4]],
    'Library': [[39, 40, 17, 5], [12, 65, 18, 5]]
  };
  var satChart = makeChart('#sat-chart', satisfactions, ['High', 'Medium', 'Low', 'Don\'t Know'], ['Dec 2014', 'May 2015']);

  var samsat = {
    'Water': [[85, 75]],
    'Sewerage': [[54, 39]],
    'Solid waste': [[70, 62]],
    'Roads': [[43, 42]],
    'Street Lighting': [[55, 48]],
    'Mother and Child Care': [[57, 43]],
    'Cemetery': [[80, 53]],
    'Parks': [[52, 38]],
    'Playgrounds': [[49, 37]],
    'Library': [[59, 53]]
  };

  var samChart = makeChart('#sam-chart', samsat, ['Samurdhi', 'Others']);

  var availability = {
    'Water': [[96, 4, 0]],
    'Sewerage': [[74, 17, 10]],
    'Solid waste': [[98, 2, 1]],
    'Roads': [[90, 6, 4]],
    'Street Lighting': [[90, 3, 6]],
    'Mother and Child Care': [[49, 48, 4]],
    'Cemetery': [[67, 28, 5]],
    'Parks': [[32, 44, 24]],
    'Playgrounds': [[26, 57, 17]],
    'Library': [[32, 49, 19]]
  };
  var availChart = makeChart('#avail-chart', availability, ['Available, Using', 'Available, Not Using', 'Not Available']);

}

$(init);
