function CustomTooltip(tooltipId, width){
	var tooltipId = tooltipId;
	$("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");
	
	if(width){
		$("#"+tooltipId).css("width", width);
	}
	
	hideTooltip();
	
	function showTooltip(content, event){
		$("#"+tooltipId).html(content);
		$("#"+tooltipId).show();
		
		updatePosition(event);
	}
	
	function hideTooltip(){
		$("#"+tooltipId).hide();
	}
	
	function updatePosition(event){
		var ttid = "#"+tooltipId;
		var xOffset = 20;
		var yOffset = 10;
		
		 var ttw = $(ttid).width();
		 var tth = $(ttid).height();
		 var wscrY = $(window).scrollTop();
		 var wscrX = $(window).scrollLeft();
		 var curX = (document.all) ? event.clientX + wscrX : event.pageX;
		 var curY = (document.all) ? event.clientY + wscrY : event.pageY;
		 var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
		 if (ttleft < wscrX + xOffset){
		 	ttleft = wscrX + xOffset;
		 } 
		 var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
		 if (tttop < wscrY + yOffset){
		 	tttop = curY + yOffset;
		 } 
		 $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
	}
	
	return {
		showTooltip: showTooltip,
		hideTooltip: hideTooltip,
		updatePosition: updatePosition
	}
}


function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Title: </span><span class="value">' +
    d.name +
    '</span><br/>';
    tooltip.showTooltip(content, d3.event);
  }

  function moreDetail(d){
     // change outline to indicate hover state.
    //d3.select(this).attr('stroke', 'black');

    var content = 
    '<span class="name">Title: </span><span class="value">' + d.name+'</span><br/>'
    +'<span class="name">Investigator: </span><span class="value">Test</span></br>'
    +'<span class="name">Academic Unit: </span><span class="value">'+'test'+'</span></br>'
    +'<span class="name">Funding Agency: </span><span class="value">'+'test'+'</span></br>'
    +'<span class="name">Start Year: </span><span class="value">'+'test'+'</span></br>'
    +'<span class="name">End Year: </span><span class="value">'+'test'+'</span></br>';
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
   function hideDetail(d) {
    // reset outline

    d3.select(this)
    .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }
  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
  }

  function clickFunction(d){
    moreDetail(d);

  }