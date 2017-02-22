

function drawCountryMap(articles){

    var urls = {
        us: "us.json", 
        keys: "statesHash.csv"
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
    .range(['#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081']);

    // make a map
    var map = d3.select('#mapViz').append('svg')
    .attr("id", "mapsvg")
    .style('height', height + 'px')
    .style('width', width + 'px');

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        console.log("test");
        return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
    })

    map.call(tip);


    // queue and render
    d3.queue()
    .defer(d3.json, urls.us)
    .defer(d3.csv, urls.keys)
    .await(render);

    // catch the resize
    d3.select(window).on('resize', resize);


    function render(err, us, abbr) {
        statesDict={}

        abbr.forEach(function(entry){
            statesDict[entry.full] = entry.short
        });



        var stateCounts = getCounts(articles)[1];

        var land = topojson.mesh(us, us.objects.land)
        , states = topojson.feature(us, us.objects.states);


        colors.domain(d3.extent(d3.values(stateCounts).map(d=>Math.log(d))));



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

            var stateName = d.properties.name.toUpperCase(); 
            var short = statesDict[stateName]; 

            if (stateCounts.hasOwnProperty(short)){
                var stateCount = stateCounts[short]
                return colors(Math.log(stateCount));
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



    addLegend("#legendDiv", colors)

}///drawCountyMap


function destroyMap(){
    d3.select("#mapsvg").remove()
}

function createEventListeners(){
    d3.selectAll(".radio-inline").on("change", function(){
        destroyMap();//remove the old map

        currentValue = d3.select('input[name="map"]:checked').node().value
        if(currentValue === "usa"){
            drawCountryMap(window.data);
        }
        if(currentValue === "world"){
            drawWorldMap(window.data);

        }
    });
}

function drawWorldMap(data){

    var urls = {
        world: "countries.topo.json"
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
.scale(width/9)
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

        countryCounts = getCounts(data)[0];

        colors.domain(d3.extent(d3.values(countryCounts).map(d=>Math.log(d))));


        map.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d){
            var name = d.properties.name.toUpperCase();
            if(countryCounts.hasOwnProperty(name)){
                return colors(Math.log(countryCounts[name]));
            }
            else{
                return "#d3d3d3"; 
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


        function addLegend(target, scale){
            d3.selectAll("#legend").remove(); 

            var legendSvg = d3.select("#legendDiv").append("svg").attr("width", 200).attr("height", 200).attr("id", "legend"); 

            scale.range().forEach(function(d, i){
                legendSvg.append("rect").attr("height", 20).attr("width", 20).attr("x", 10).attr("y", 10+ i*25).style("fill", d);
                legendSvg.append("text").attr("x", 40).attr("y", 10+10+i*25).text(d).style("alignment-baseline", "middle").style("font-size", 20);
            })  
        }

        function draw(){
            d3.json("external-2016-11-4.json", function(data){
                window.data = data;
                drawCountryMap(data);
            }); 
        }