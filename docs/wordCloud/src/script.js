var myWordCloud;
d3.json("data/KWbyPersonCount.json", function(data) {

    words = transformUniversityWordCloud(data); 
    smallWords = words.filter((d, i) => i < 100); 

    var currentWords = smallWords;
    //console.log(words);
    //Create a new instance of the word cloud visualisation.
    myWordCloud = wordCloud('#canvas');
    showNewWords(myWordCloud, smallWords);

});