

function getHtmlString(d) {
    var text = '<b>' + d.text + '</b>,' + '<font class="text-muted"> person count: N</font>, ' + '<font class="text-warning">article count: ' + d.articleCount + '</font>';
    return text;
}
function parseRgb(rgbString) {
    var commaString = rgbString.substring(4, rgbString.length - 1);
    var numberStrings = commaString.split(",");
    var nums = [];
    for (var i = 0; i < numberStrings.length; i++) {
        nums.push(parseInt(numberStrings[i]));
    }
    return nums;
}

function toRgbString(rgbs) {
    return "rgb(" + rgbs[0] + "," + rgbs[1] + "," + rgbs[2] + ")";
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

function changeOnHover(d){
    d3.select(this).style("cursor", "pointer");
    var currentColor = d3.select(this).style("fill");
    var rgbs = parseRgb(currentColor);
    var brighterFill = toRgbString(brighten(rgbs, 40));
    d3.select(this).style("fill", brighterFill);
    d3.select("#content").html(getHtmlString(d));
}

function hideTooltip(){
    d3.select(".d3-tip").style("opacity", 0).style("pointer-events", "none");
}