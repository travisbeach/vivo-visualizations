function transformUniversityWordCloud(rawData) {
	return rawData.map(processKeywordStructure);
	
	function processKeywordStructure(kwStruct) {
       return {
           persons: kwStruct.persons.map(processPersonStructure),
           countOfArticle: kwStruct.countOfArticle,
           keyword: kwStruct.keyword,
           countByPerson: kwStruct.countByPerson, 
           type: randomType()
       }

       function processPersonStructure(pStruct) {  
        return {
            personName: pStruct.personName,
            personURI: pStruct.personURI,
            articleCount: pStruct.articleCount
        }
    }
}
//function to randomly apply type to each incoming word. 
function randomType(){
    return Math.random() > .5 ? "mesh" : "keyword"; 
}
}

function wordCloud(selector) {
    //Categorical color scale--basically random
    var fill = d3.scale.category20c();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
    .attr("width", 850)
    .attr("height", 450)
    .attr("id", "viz")
    .append("g")
    .attr("transform", "translate(425,225)");


    //Draw the word cloud
    function draw(input) {

        var tip = d3.tip().attr('class', 'sitewc d3-tip choices triangle-isosceles').html(function(d) {
            var repr = "<p><span class='titleTip'>"+d.text+"</span><span id='close' onclick ='hideTooltip()'><img src= 'whiteX.png' ID='closeIcon' alt='close'></span></p>"
            for (var i = 0; i < d.persons.length; i++) {
                repr += "<div class='hoverable'><a href='" + d.persons[i].personURI + "'>" + (i + 1) + ". " + d.persons[i].personName + " (" + d.persons[i].articleCount + ")</a></div>";
            }
            return repr;
        });

        var cloud = svg.selectAll("g text")
        .data(input, function(d) { return d.keyword; }); 

        //Entering words
        cloud.enter()
        .append("text")
        .style("font-family", "Tahoma")
        .attr("class", "word")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr('font-size', 1)
        .text(function(d) { return d.keyword; });

        //Entering and existing words
        cloud
        .transition()
        .duration(600)
        .style("font-size", function(d) { return d.size + "px"; })
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("fill-opacity", 1);

        if(input[0] != null){
            cloud
            .call(tip)
            .on('click', tip.show)
            .on('mouseover', showDetails);
        }

        //Exiting words
        cloud.exit()
        .transition()
        .duration(200)
        .style('fill-opacity', 1e-6)
        .attr('font-size', 1)
        .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(input) {
            //recalculate font scale based on updated data. 
            var fontScale = makeScale(input);
            //hide tooltip on change of vis to prevent 'hanging' tooltip
            hideTooltip();

            d3.layout.cloud().size([800, 400])
            .words(input, d=>d.keyword)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Tahoma")
            .fontSize(function(d) { return fontScale(d.countOfArticle); })
            .text(d=>d.keyword)
            .on("end", draw)
            .start();
        }
    }

}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, words) {
    vis.update(words)
}


d3.selectAll(".cbox").on("change", function(){
 var checks = getChecks(); 
 var currentWords = smallWords;

 if(checks[0] == false){
    currentWords = currentWords.filter(function(d){
        return d.type != 'keyword'; 
    });
}

if(checks[1] == false){
    currentWords = currentWords.filter(function(d){
        return d.type != 'mesh'; 
    });
}
if(checks[2] == false){
    currentWords = currentWords.filter(function(d){
        return d.type != 'mined';
    });
}

showNewWords(myWordCloud, currentWords); 
})

var checks;

/*Returns the status of the checkboxes as an array*/
function getChecks(){
 var keyword = d3.select("#keyword").property("checked"); 
 var mesh = d3.select("#mesh").property("checked"); 
 var mined = d3.select("#mined").property("checked"); 

 return [keyword, mesh, mined]; 
}

/*Returns a function that is a linear scale between 5 and 50 pixels based on array. 
Called before the draw procedure to ensure that less frequent words become more visible 
when high frequency words have been filtered.*/
function makeScale(array){
    var domain = d3.extent(array, d=>d.countOfArticle); 
    return d3.scale.linear().domain(domain).range([5, 50]);
}
