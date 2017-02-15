


function drawCountryMap(){

    var urls = {
        us: "us.json", 
        data: "subset.json", 
        keys: "statesHash.json"
    }

    var margin = {top: 10, left: 10, bottom: 10, right: 10}
    , width = parseInt(d3.select('.col-md-8').style('width'))
    , width = width - margin.left - margin.right
    , mapRatio = .5
    , height = width * mapRatio;

    var formats = {
        percent: d3.format('%')
    };

// projection and path setup
var projection = d3.geo.albersUsa()
.scale(width)
.translate([width / 2, height / 2]);

var path = d3.geo.path()
.projection(projection);

    // scales and axes
    var colors = d3.scale.quantize()
    .range(['#e0f3db','#ccebc5']);

    // make a map
    var map = d3.select('#mapViz').append('svg')
    .attr("id", "mapsvg")
    .style('height', height + 'px')
    .style('width', width + 'px');

    // queue and render
    d3.queue()
    .defer(d3.json, urls.us)
    .defer(d3.json, urls.data)
    .defer(d3.json, urls.keys)
    .await(render);

    // catch the resize
    d3.select(window).on('resize', resize);


    function render(err, us, data, abbr) {
        console.log(data);
        var stateCounts = getCounts(data)[1];

        var land = topojson.mesh(us, us.objects.land)
        , states = topojson.feature(us, us.objects.states);

        window.us = us;

        colors.domain(d3.values(stateCounts))

        map.append('path')
        .datum(land)
        .attr('class', 'land')
        .attr('d', path);

        var states = map.selectAll('path.state')
        .data(states.features)
        .enter().append('path')
        .attr('class', 'state')
        .attr('id', function(d) { 
            return d.properties.name.toLowerCase().replace(/\s/g, '-'); 
        })
        .attr('d', path)
        .style('fill', function(d) {
            console.log(stateCounts);
            console.log(d.properties.name.toUpperCase());
            if (stateCounts.hasOwnProperty(d.properties.name.toUpperCase())){
                return colors(stateCounts[d.properties.name.toUpperCase()]);
            }
            else{
                return "#FFF";
            }
        });


    }

    function resize() {
        // adjust things when the window size changes
        width = parseInt(d3.select('.col-md-8').style('width'));
        width = width - margin.left - margin.right;
        height = width * mapRatio;

        // update projection
        projection
        .translate([width / 2, height / 2])
        .scale(width);

        // resize the map container
        map
        .style('width', width + 'px')
        .style('height', height + 'px');

        // resize the map
        map.select('.land').attr('d', path);
        map.selectAll('.state').attr('d', path);
    }

}///drawCountyMap


function destroyMap(){
    d3.select("#mapsvg").remove()
}

function createEventListeners(){
    d3.selectAll(".radio-inline").on("change", function(){
        destroyMap();//remove the old map

        currentValue = d3.select('input[name="map"]:checked').node().value
        if(currentValue === "usa"){
            drawCountryMap();
        }
        if(currentValue === "world"){
            drawWorldMap();

        }
    });
}

function drawWorldMap(){

    var urls = {
        world: "world-110m2.json"
    }

    var margin = {top: 10, left: 10, bottom: 10, right: 10}
    , width = parseInt(d3.select('.col-md-8').style('width'))
    , width = width - margin.left - margin.right
    , mapRatio = .5
    , height = width * mapRatio;

    var formats = {
        percent: d3.format('%')
    };

// projection and path setup
var projection = d3.geo.mercator()
.scale(width)
.translate([width / 2, height / 2]);

var path = d3.geo.path()
.projection(projection);

    // scales and axes
    var colors = d3.scale.quantize()
    .range(['#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac']);

    // make a map
    var map = d3.select('#mapViz').append('svg')
    .attr("id", "mapsvg")
    .style('height', height + 'px')
    .style('width', width + 'px');

    // queue and render
    d3.queue()
    .defer(d3.json, urls.world)
    .await(render);

    // catch the resize
    d3.select(window).on('resize', resize);


    function render(err, world) {

        window.world = world;


        map.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)


    }

    function resize() {
        // adjust things when the window size changes
        width = parseInt(d3.select('.col-md-8').style('width'));
        width = width - margin.left - margin.right;
        height = width * mapRatio;

        // update projection
        projection
        .translate([width / 2, height / 2])
        .scale(width);

        // resize the map container
        map
        .style('width', width + 'px')
        .style('height', height + 'px');

        // resize the map
        map.select('.land').attr('d', path);
        map.selectAll('.state').attr('d', path);
    }

}


        /*
        getCounts accepts an array of objects that have been parsed from json input. 
        Returns: an array with two objects.
        */
        function getCounts(testObjects){

            var collabCounter = {};
            var statesCounter = {};

            testObjects.forEach(function(paper){
                paper.authors.forEach(function(author){
                    if(collabCounter.hasOwnProperty(author.country)){
                        collabCounter[author.country] ++; 
    
                    }
                    else{
                        collabCounter[author.country] = 1;
                    }
                    if(author.country === "UNITED STATES"){
                        if(statesCounter.hasOwnProperty(author.state)){
                            statesCounter[author.state] ++; 
                        }
                        else{
                            statesCounter[author.state] = 1;
                        }
                    }
                })
            })

            return [collabCounter, statesCounter];
        }

