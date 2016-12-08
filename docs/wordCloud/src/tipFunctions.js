

function getHtmlString(d) {
    console.log(d)
    var text = '<b>' + d.text + '</b>,' + '<font class="text-muted"> person count:'+d.countByPerson+'</font>, ' + '<font class="text-warning">article count: ' + d.countOfArticle + '</font>';
   
    return text;
}

function hideTooltip(){
    d3.selectAll(".d3-tip").style("opacity", 0).style("pointer-events", "none");
}

function showDetails(d){
    hideDetails(d);
    d3.select(this).style("cursor", "pointer");
    var spot = d3.select("#hover").append("text").attr("x", 10).attr("y", 10).attr("class", "details").attr("text-anchor", "start").html(getHtmlString(d));
}

function hideDetails(d){
    d3.select("#hover").selectAll(".details").remove();
}