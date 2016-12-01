function transformUniversityWordCloud(rawData) {
	return rawData.map(processKeywordStructure);
	
	function processKeywordStructure(kwStruct) {
	    return {
	        persons: kwStruct.persons.map(processPersonStructure),
	        countOfArticle: kwStruct.countOfArticle,
            keyword: kwStruct.keyword,
            countByPerson: kwStruct.countByPerson, 
            type: randomType(), 
            size: 5+(Math.random()*30)
            }
       
        function processPersonStructure(pStruct) {  
            return {
                personName: pStruct.personName,
                personURI: pStruct.personURI,
                articleCount: pStruct.articleCount
            }
        }
	}

    function randomType(){
        return Math.random() > .5 ? "mesh" : "keyword"; 
    }
}

function drawUniversityWordCloud(transformed, target) {

    var fill = d3.scale.category20();

	var height = 400; 
    var width = 400;

    var keywordScale = d3.scale.linear().range([5, 50]);

   var tip = d3.tip().attr('class', 'sitewc d3-tip choices triangle-isosceles').html(function(d) {
        var repr = "";
        for (var i = 0; i < d.entities.length; i++) {
            repr += "<div class='hoverable'><a href='" + d.entities[i].uri + "'>" + (i + 1) + ". " + d.entities[i].text + " (" + d.entities[i].artcount + ")</a></div>";
        }
        return repr;
    })

    

    var keywords;

    keywords = transformed.filter(function(d) {
        return + d.countByPerson > 0;
    }).map(function(d) {
        var entities = [];
        for (var i = 0; i < d.persons.length; i++) {
            entities.push({
                text: d.persons[i].personName,
                uri: d.persons[i].personURI,
                artcount: d.persons[i].articleCount
            });
        }

        entities.sort(function(a, b) {
            return b.artcount - a.artcount;
        });

        return {
            text: d.keyword,
            size: +d.countByPerson,
            articleCount: +d.countOfArticle,
            entities: entities
        };
    }).sort(function(a, b) {
        return d3.descending(a.size, b.size);
    });

    keywordScale.domain([d3.min(keywords,
    function(d) {
        return d.size;
    }), d3.max(keywords,
    function(d) {
        return d.size;
    })]);
    
    var wordsToFills = {};

    d3.layout.cloud().size([width, height]).words(keywords).rotate(function() {
        return~~ (Math.random() * 2) * 90;
    }).font("Tahoma").fontSize(function(d) {
        return keywordScale(d.size);
    }).on("end", draw).start();
    
    //activateInfoButton();

    function parseRgb(rgbString) {
        var commaString = rgbString.substring(4, rgbString.length - 1);
        var numberStrings = commaString.split(",");
        var nums = [];
        for (var i = 0; i < numberStrings.length; i++) {
            nums.push(parseInt(numberStrings[i]));
        }
        return nums;
    }

    function brighten(rgbs, p) {
        var result = [];
        for (var i = 0; i < rgbs.length; i++) {
            if (rgbs[i] + 20 <= 255) {
                result.push(rgbs[i] + p);
            } else {
                result.push(255);
            }
        }
        return result;
    }

    function toRgbString(rgbs) {
        return "rgb(" + rgbs[0] + "," + rgbs[1] + "," + rgbs[2] + ")";
    }

    function draw(words) {
        d3.select(target).append("svg").attr("width", width).attr("height", height).attr("id", "stage").append("g").attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")").selectAll("text").data(words).enter().append("text").style("font-size",
        function(d) {
            return d.size + "px";
        }).style("font-family", "Tahoma").style("fill",
        function(d, i) {
            var wordFill = fill(i);
            wordsToFills[d.text] = wordFill;
            return wordFill;
        }).attr("text-anchor", "middle").attr("transform",
        function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        }).text(function(d) {
            return d.text;
        }).call(tip).on('click', tip.show).on('mouseover',
        function(d) {
            d3.select(this).style("cursor", "pointer");
            var currentColor = d3.select(this).style("fill");
            var rgbs = parseRgb(currentColor);
            var brighterFill = toRgbString(brighten(rgbs, 40));
            d3.select(this).style("fill", brighterFill);
            d3.select("#content").html(getHtmlString(d));
        }).on('mouseout',
        function(d) {
            d3.select(this).style("fill", wordsToFills[d.text]);
        });

        
    }

    function getHtmlString(d) {
        var text = '<b>' + d.text + '</b>,' + '<font class="text-muted"> person count: ' + findEntityLength(d.text) + '</font>, ' + '<font class="text-warning">article count: ' + d.articleCount + '</font>';
        return text;
    }

    function findEntityLength(t) {
        for (var i = 0; i < keywords.length; i++) {
            var item = keywords[i];
            if (item.text === t) {
                return item.entities.length;
            }
        }
    }

    $(document).click(function(e) {
        if ((!$(e.target).closest('text').length && !$(e.target).is('text')) || (!$(e.target).closest('#stage').length && !$(e.target).is('#stage'))) {
            tip.hide();
            d3.select("#content").text('');
        }
    });
   
    function activateInfoButton() {
        $('[data-toggle="tooltip"]').tooltip();
        console.log("Activated tooltips");
    }
    
}

function updateCloud(words){
    test = d3.select("#stage").selectAll("text").data(words);
    test.exit().remove(); 
}



function wordCloud(selector) {

    var fill = d3.scale.category20c();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
    .attr("width", 850)
    .attr("height", 450)
    .append("g")
    .attr("transform", "translate(425,225)");


    //Draw the word cloud
    function draw(input) {


        var cloud = svg.selectAll("g text")
        .data(input, function(d) { return d.keyword; })

        //Entering words
        cloud.enter()
        .append("text")
        .style("font-family", "Tahoma")
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

            var fontScale = makeScale(input);

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

//Some sample data - http://en.wikiquote.org/wiki/Opening_lines
var words = [
"You don't know about me without you have read a book called The Adventures of Tom Sawyer but that ain't no matter.",
"The boy with fair hair lowered himself down the last few feet of rock and began to pick his way toward the lagoon.",
"When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",
"It was inevitable: the scent of bitter almonds always reminded him of the fate of unrequited love."
]

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
    return words[i]
    .replace(/[!\.,:;\?]/g, '')
    .split(' ')
    .map(function(d) {
        return {text: d, size: 10 + Math.random() * 60};
    })
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

function getChecks(){
   var keyword = d3.select("#keyword").property("checked"); 
   var mesh = d3.select("#mesh").property("checked"); 
   var mined = d3.select("#mined").property("checked"); 

   return [keyword, mesh, mined]; 
}

function makeScale(array){
    var domain = d3.extent(array, d=>d.countOfArticle); 
    return d3.scale.linear().domain(domain).range([5, 50]);
}
