

function getHtmlString(d) {
    var text = '<b>' + d.text + '</b>,' + '<font class="text-muted"> person count: N</font>, ' + '<font class="text-warning">article count: ' + d.articleCount + '</font>';
    console.log(text);
    return text;
}

function hideTooltip(){
    d3.selectAll(".d3-tip").style("opacity", 0).style("pointer-events", "none");
}

function showDetails(d){
    var spot = d3.select("#viz").append("text").attr("x", 10).attr("y", 10).attr("class", "details").attr("text-anchor", "start").html(getHtmlString(d));
}
function hideDetails(d){
    d3.select("#canvas").selectAll(".details").remove();
}