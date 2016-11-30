var words; 
var smallerWords;
d3.json("data/KWbyPersonCount.json", function(data){
	words = transformUniversityWordCloud(data); 
	smallerWords = words.filter((d, i)=>i<10);
	drawUniversityWordCloud(words, "#viz");

}); 