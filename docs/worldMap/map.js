function drawMap(locationIn){
    
    var urls, projection;
    
    //state map
    if (locationIn == "state"){
        urls = {location: "us.json", 
                keys: "statesHash.csv", 
                counts: "ExternalCollaborations-State.json"
            }

        projection = d3.geo.albersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);
    }
    //world map
    if (locationIn == "country"){
        urls = {location: "countries.topo.json", 
                keys: "countryHash.json", 
                counts: "ExternalCollaborations-State.json"
            }

        projection = d3.geo.mercator()
        .scale(width / 9)
        .translate([width / 2, height / 2]);
    }
    
    var margin = { top: 10, left: 10, bottom: 10, right: 10 }
        , width = parseInt(d3.select('.col-md-7').style('width'))
        , width = width - margin.left - margin.right
        , mapRatio = .5
        , height = width * mapRatio;

    var path = d3.geo.path()
        .projection(projection);
    

    var map = d3.select('#mapViz').append('svg')
        .attr("id", "mapsvg")
        .style('height', height + 'px')
        .style('width', width + 'px');



    d3.queue()
        .defer(d3.json, urls.location)
        .defer(d3.csv, urls.keys)
        .defer(d3.json, urls.counts)
        .await(render);

    // catch the resize
    d3.select(window).on('resize', resize);

    function render(err, location, abbr, counts){
        var geometries; 
        if (locationIn == "state"){
            geometries = topojson.feature(location, location.objects.states).features;
        }

        if (locationIn == "country"){
            geometries = topojson.feature(location, location.objects.countries).features;
        }
       
        var paths = map.selectAll('path')
            .data(geometries)
            .enter()
            .append('path')
            .attr('class', locationIn)
            .attr('d', get);

        resize();
    }   

    function resize() {
        // adjust things when the window size changes
        width = parseInt(d3.select('.col-md-7').style('width'));
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

function draw(){
    drawMap("country")
}
show