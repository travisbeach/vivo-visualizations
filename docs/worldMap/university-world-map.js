

function drawCountryMap(articles) {

    articles['NY'] = articles['NY'].filter(nyFilter);

    addChecks("#academicUnit", getAcademicUnits(articles));
    addChecks("#subjectArea", getSubjectArea(articles));
    addYears(articles);


    var urls = {
        us: "us.json",
        keys: "statesHash.csv"
    }

    var margin = { top: 10, left: 0, bottom: 10, right: 0 }
        , width = parseInt(d3.select('.col-md-7').style('width'))
        , width = width - margin.left - margin.right
        , mapRatio = .6
        , height = width * mapRatio;

    // projection and path setup
    var projection = d3.geo.albersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    // scales and axes
    var colors = d3.scale.quantize()
        .range(['#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081']);

    // make a map
    var map = d3.select('#mapViz').append('svg')
        .attr("id", "mapsvg")
        .style('height', height + 'px')
        .style('width', width + 'px');


    var rect = map.append("rect")
        .attr("id", "background-rectangle")
        .style("height", height)
        .style("width", width)
        .style("fill", "white");

    rect.on("click", hideSidebar);

    // queue and render

    d3.queue()
        .defer(d3.json, urls.us)
        .defer(d3.csv, urls.keys)
        .await(render);

    // catch the resize
    d3.select(window).on('resize', resize);

    var g = map.append("g");

    function render(err, us, abbr) {
        statesDict = {}

        abbr.forEach(function (entry) {
            statesDict[entry.full] = entry.short
        });

        //var stateCounts = getCounts(articles)[1];

        var states = topojson.feature(us, us.objects.states);
        //console.log(states.features);
        function getStateCounts(d) {
            var stateName = d.properties.name.toUpperCase();
            var short = statesDict[stateName];

            if (articles.hasOwnProperty(short)) {
                var smallerArticles = articles[short]; 
                
                return smallerArticles.length;
                
        }
            else {
                return 0;
            }
        }    

        function fillSidebar(d) {
            var state = statesDict[d.properties.name.toUpperCase()];
            window.state = state;
            arts = articles[state]; 


            var researchersList = arts.map(d=>d.authors).reduce((a,b)=>a.concat(b)).filter(fromCornell); 
           
            var topResearchers = authorCounter(researchersList)
            //console.log(topResearchers);
            d3.select("#researchers").selectAll("p").remove();
            d3.select("#researchers").selectAll("p").data(topResearchers).enter().append("p").attr("class", "linked").append("a").attr("href", d=>d.uri).html(d=>d.name + "<span class='counts'>(" + d.count + ") </span>"); 
            var institutionList = arts.map(d=>d.authors).reduce((a,b)=>a.concat(b)).filter(correctState);
            var topInstitutions = institutionCounter(institutionList).filter(containsCornell);
            d3.select("#institutions").selectAll("p").remove();
            d3.select("#institutions").selectAll("p").data(topInstitutions).enter().append("p").attr("class", returnLink).append("a").attr("href", d=>d.uri).attr("target", "_blank").html(d=>d.name + "<span class='counts'>(" + d.count + ") </span>"); 

            d3.select("#bigCounts").html(d=>"("+arts.length+")");

        }
        function containsCornell(d){
            if (d.name.toLowerCase().includes("cornell")){
                return false; 
            }
            else{
                return true; 
            }
        }
        function returnLink(d){
            if (d.uri){
                return "linked";
            }
            else{
                return "unlinked";
            }
        }

        function correctState(d){
            
            if(d.state == window.state){
                return true;
            }
            else{
                return false; 
            }
        }
        function fromCornell(d){
            if (d.authorAffiliation.localName === "Cornell University" || d.authorAffiliation.localName === "CORNELL UNIV"){
                return true;
            }
            else{
                return false;
            }
        }

        function notCornell(d){
            return !fromCornell(d); 
        }
    

        function stateClick(d) {
            sidebar(d);
            fillSidebar(d);
        }

        
        var tip = d3.tip().attr('class', 'd3-tip').html(function (d) { return d.properties.name + " (" + getStateCounts(d) + ")"; });

        /* Invoke the tip in the context of your visualization */
        map.call(tip)

        function stateMouseover(d) {
            tip.show(d)
        }
        function stateMouseout(d) {
            tip.hide();
        }

        colors.domain(d3.extent(d3.values(articles).map(d => Math.log(d.length))));

        d3.select("#rh-panel").on("click", hideSidebar)
        
        var statePaths = g.selectAll('path.state')
            .data(states.features)
            .enter().append('path')
            .attr('class', 'state')
            .attr('d', path)
            .on("click", stateClick)
            .on("mouseover", stateMouseover)
            .on("mouseout", stateMouseout)
            .style('fill', function (d) {
                return colors(Math.log(getStateCounts(d)));
            });

        //addLegend("#legendDiv", colors)

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



    

}///drawCountyMap


function destroyMap() {
    d3.select("#mapsvg").remove()
}

function createEventListeners() {
    d3.selectAll(".radio-inline").on("change", function () {
        destroyMap();//remove the old map

        currentValue = d3.select('input[name="map"]:checked').node().value
        if (currentValue === "usa") {
            drawCountryMap(window.data);
        }
        if (currentValue === "world") {
            drawWorldMap(window.data);

        }
    });

}

function sidebar(d) {
    var panel = d3.select("#rh-panel");

    d3.selectAll(".list").style({"border-style":"solid", "border-color": "white", "border-width": "1px"});
    d3.selectAll(".rule").transition(500).delay(500).style("display", "block");
    if (panel.classed('closed')) {
        panel.style("width", "25%");
        panel.classed("closed", false);
        panel.select("#areaTitle").style("opacity", 0).html(d.properties.name + "<span id='bigCounts'></span>").transition(500).delay(500).style("opacity", 1);
    }

    else {
        panel.select("#areaTitle").style("opacity", 0).html(d.properties.name + "<span id='bigCounts'></span>").transition(100).delay(100).style("opacity", 1);
    }

    d3.select("#res").text("Featured Cornell Researchers");
    d3.select("#inst").text("Featured Institutions");
}


function hideSidebar() {
    var panel = d3.select("#rh-panel");
    panel.style("width", "3%");
    panel.classed("closed", true)
    panel.select("#areaTitle").style("opacity", 0).text("");
    d3.selectAll("p").remove();
    d3.selectAll(".heading").text("");
    d3.selectAll(".list").style("border", "hidden");
    d3.selectAll(".rule").style("display", "none");
}




function drawWorldMap(data) {

    var urls = {
        world: "countries.topo.json"
    }

    var margin = { top: 10, left: 10, bottom: 10, right: 10 }
        , width = parseInt(d3.select('.col-md-7').style('width'))
        , width = width - margin.left - margin.right
        , mapRatio = .5
        , height = width * mapRatio;

    var formats = {
        percent: d3.format('%')
    };

    // projection and path setup
    var projection = d3.geo.mercator()
        .scale(width / 6)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    // scales and axes
    var colors = d3.scale.quantize()
        .range(['#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac']);

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

        colors.domain(d3.extent(d3.values(countryCounts).map(d => Math.log(d))));

        function getCountryCounts(d) {
            var name = d.properties.name.toUpperCase();
            if (countryCounts.hasOwnProperty(name)) {
                return countryCounts[name];
            }
            else {
                return 0;
            }

        }



        var tip = d3.tip().attr('class', 'd3-tip').html(function (d) { return d.properties.name + " (" + getCountryCounts(d) + ")"; });

        /* Invoke the tip in the context of your visualization */
        map.call(tip)

        function countryMouseover(d) {
            tip.show(d)
        }
        function countryMouseout(d) {
            tip.hide();
        }





        map.selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append("path")
            .attr("d", path)

            .style("fill", function (d) {
                return colors(Math.log(getCountryCounts(d)));
            })
            .on("mouseover", countryMouseover)
            .on("mouseout", countryMouseout);

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


/*
getCounts accepts an array of objects that have been parsed from json input. 
Returns: an array with two objects.
*/
function getCounts(testObjects) {

    var collabCounter = {};
    var statesCounter = {};

    testObjects.forEach(function (paper) {
        paper.authors.forEach(function (author) {
            if (collabCounter.hasOwnProperty(author.country)) {
                collabCounter[author.country]++;
            }
            else {
                collabCounter[author.country] = 1;
            }
            if (author.country === "UNITED STATES") {
                if (statesCounter.hasOwnProperty(author.state)) {
                    if (!author.cornellAffiliation && author.authorAffiliation !== "Cornell University" && author.authorAffiliation !== "CORNELL UNIV") {
                        statesCounter[author.state]++;
                    }
                }
                else {
                    statesCounter[author.state] = 1;
                }
            }
        })
    })

    return [collabCounter, statesCounter];
}


function addLegend(target, scale) {
    d3.selectAll("#legend").remove();
    var increment = scale.domain()[1]/scale.range().length;
 
    var legendSvg = d3.select("#legendDiv").append("svg").attr("width", 200).attr("height", 250).attr("id", "legend");
    
    scale.range().forEach(function (d, i) {
        legendSvg.append("rect").attr("height", 20).attr("width", 20).attr("x", 10).attr("y", 10 + i * 25).style("fill", d);
        legendSvg.append("text").attr("x", 40).attr("y", 12 + 10 + i * 25).text(function(d){
            
            return Math.floor(Math.exp(increment*i)) + " - " +  Math.floor(Math.exp(increment*(i+1))); 
        }).style("alignment-baseline", "middle").style("font-size", 20);
        console.log(d);
    })
}

function draw() {
    d3.json("ExternalCollaborations-StateUpdated.json", function (data) {
        window.data = data;
        drawCountryMap(data);
    });
}

function hideFields() {
    d3.select("#areaTitle").text("");
}

function uniqueCountPreserve(inputArray){
    //Sorts the input array by the number of time
    //each element appears (largest to smallest)

    //Count the number of times each item
    //in the array occurs and save the counts to an object
    var arrayItemCounts = {};
    for (var i in inputArray){
        if (!(arrayItemCounts.hasOwnProperty(inputArray[i]))){
            arrayItemCounts[inputArray[i]] = 1
        } else {
            arrayItemCounts[inputArray[i]] += 1
        }
    }

    //Sort the keys by value (smallest to largest)
    //please see Markus R's answer at: http://stackoverflow.com/a/16794116/4898004
    var keysByCount = Object.keys(arrayItemCounts).sort(function(a, b){
        return arrayItemCounts[a]-arrayItemCounts[b];
    });

    //Reverse the Array and Return
    return(keysByCount.reverse())
}

function getAcademicUnits(articles){
    var units = [];
    Object.keys(articles).forEach(function(state){
        var stateArticles = articles[state]; 
        var stateAuthors = stateArticles.map(d=>d.authors).reduce((a, b)=>a.concat(b)); 
        //console.log(state);
        var stateUnits = stateAuthors.map(d=>d.cornellAffiliation).map(d=>d===null ? [] : d).reduce((a, b)=>a.concat(b)); 
        //console.log(stateUnits);
        units.push(stateUnits); 
    })

    units = units.reduce((a,b)=>a.concat(b)); 
    return _.uniq(units); 
}

function getSubjectArea(articles){
    var areas = []; 
     Object.keys(articles).forEach(function(state){
        var stateArticles = articles[state]; 
        var stateAreas = stateArticles.map(d=>d.subjectAreas).map(d=>d===null ? [] : d).reduce((a, b)=>a.concat(b)); 
        areas.push(stateAreas); 
    })
    return _.uniq(areas.reduce((a,b)=>a.concat(b))); 
}

function addChecks(target, list){
   var anchorDiv = d3.select(target); 
	var labels = anchorDiv.selectAll("div")
	.data(list.sort())
	.enter()
	.append("li"); 
	labels
	.append("input")
	.attr("checked", true)
	.attr("type", "checkbox")
	.attr("class", "cbox"); 

    labels.append("label").attr("class", "label").html(d=>d);
}
function getYears(articles){
    var years = []; 
     Object.keys(articles).forEach(function(state){
        var stateArticles = articles[state]; 
        var stateYears = stateArticles.map(d=>+d.yearOfPublication); 
        years.push(stateYears); 
    }) 
    return _.uniq(years.reduce((a,b)=>a.concat(b))); 
}
function addYears(articles){
    var yearExtent = d3.extent(getYears(articles)); 
    var range = document.getElementById('range');
      noUiSlider.create(range, {
          start: yearExtent, // Handle start position
          connect: true, // Display a colored bar between the handles
          step: 1, 
          tooltips: true,
          format: {
            to: function ( value ) {
              return value;
            },
            from: function ( value ) {
              return value;
            }}, 
          range: { // Slider can select '0' to '100'
          'min': yearExtent[0],
          'max': yearExtent[1]
        }, 
        pips: {
          mode: 'values',
          values: yearExtent, 
          density: 75
        }
      });
}

//return a filtered list of {name:"", count: "", uri: ""}

function authorCounter(array){
    var returnObject = {}; 
    array.forEach(function(author){
        if (returnObject.hasOwnProperty(author.authorName)){
            returnObject[author.authorName].count++; 
        }
        else{
            returnObject[author.authorName] = {
                name: author.authorName, 
                count: 1, 
                uri: author.authorURI
            }
        }
    }); 

    var returnArray = []; 
    for (var property in returnObject){
        if(returnObject.hasOwnProperty(property)){
            returnArray.push(returnObject[property]);
        }
    }
    
    return returnArray.sort(function(x,y){
        return d3.descending(x.count, y.count);
        });
}

function institutionCounter(array){
    var returnObject = {}; 
    array.forEach(function(author){
        if (returnObject.hasOwnProperty(author.authorAffiliation.localName)){
            returnObject[author.authorAffiliation.localName].count++; 
        }
        else{
            returnObject[author.authorAffiliation.localName] = {
                name: author.authorAffiliation.localName, 
                count: 1, 
                uri: author.authorAffiliation.gridURI
            }
        }
    }); 

    var returnArray = []; 
    for (var property in returnObject){
        if(returnObject.hasOwnProperty(property)){
            returnArray.push(returnObject[property]);
        }
    }
    
    return returnArray.sort(function(x,y){
        return d3.descending(x.count, y.count);
        });
}

function nyFilter(d){
    var nyNotCornell = 0; 
    d.authors.forEach(function(author){
        if (author.state == 'NY' && author.authorAffiliation.localName !== 'Cornell University' && author.authorAffiliation.localName !== 'CORNELL UNIV'){
            nyNotCornell++; 
        }
    })
    return nyNotCornell > 0 ? true : false; 

}

