var width = 700;
var height = 700;
var filtered = [];
var comeback = [];
var dateFiltered = []; 
var dateComeback = [];
  // Used when setting up force and
  // moving around nodes\
  var damper = 0.102;

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('grants_tooltip', 240);
  var svg = null;
  var bubbles = null;
  var nodes = [];


  var svg = d3.select("#vis")
  .append('svg')
  .attr('width', width)
  .attr('height', height);

    // on which view mode is selected.
    var center = { x: width / 2, y: height / 2 };

    function charge(d) {
      return -Math.pow(d.radius, 2.0) / 8;
    }

    var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.01)
    .friction(0.9);


  // Nice looking colors - no reason to buck the trend
  var fillColor = d3.scale.ordinal()
  .domain(['low', 'medium', 'high'])
  .range(['#d84b2a', '#beccae', '#7aa25c']);

  // Sizes bubbles based on their area instead of raw radius
  var radiusScale = d3.scale.pow()
  .exponent(0.5)
  .range([2, 25]);


  function createNodesTravis(rawData) {
    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.

    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.Cost),
        dept: d.dept, 
        value: d.Cost,
        start: d.Start,
        end: d.End,
        name: d.Title,
        group: d.group,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });
    return myNodes;
  }

  function update(rawData){

    var maxAmount = d3.max(rawData, function (d) { return +d.Cost; });
    radiusScale.domain([0, maxAmount]);

    nodes = createNodesTravis(rawData);
    
    d3.select("#vis").selectAll(".bubble").data([]).exit().remove(); 

    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

    // Create a SVG element inside the provided selector
    // with desired size.


    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
    .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    bubbles.enter().append('circle')
    .classed('bubble', true)
    .attr('r', 0)
    .attr('fill', function (d) { return fillColor(d.group); })
    .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
    .attr('stroke-width', 2)
    .on('mouseover', showDetail)
    .on('mouseout', hideDetail)
    .on('click', clickFunction);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
    .duration(500)
    .attr('r', function (d) { return d.radius; });


    groupBubbles();

    function moveToCenter(alpha) {
      return function (d) {
        d.x = d.x + (center.x - d.x) * damper * alpha;
        d.y = d.y + (center.y - d.y) * damper * alpha;
      };
    }


    function groupBubbles() {

      force.on('tick', function (e) {
        bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
      });

      force.start();
    }
  }

  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Title: </span><span class="value">' +
    d.name +
    '</span><br/>';
    tooltip.showTooltip(content, d3.event);
  }

  function moreDetail(d){
     // change outline to indicate hover state.
    //d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Title: </span><span class="value">' +
    d.name +
    '</span><br/><span class="name">Investigator: </span><span class="value">Test</span></br><span class="name">Academic Unit: </span><span class="value">';
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
   function hideDetail(d) {
    // reset outline

    d3.select(this)
    .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }
  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
  }

  function clickFunction(d){
    moreDetail(d);

  }



