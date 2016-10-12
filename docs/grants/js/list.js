
/*Coverts an array into a Set (no duplicates)*/
let unique = a => [...new Set(a)];

/*Extracts property and returns list of those properties without duplicates*/
function getProperty(array, property){
	return unique(array.map(d=>d[property]));
	}
/*Adds a checkbox for each member of the list*/
function addList(id, array){ 
	var anchorDiv = d3.select(id); 
	var labels = anchorDiv.selectAll("div")
							.data(array)
							.enter()
							.append("div")
							.attr("class", "checkbox")
							.html(d=>"<label><input type='checkbox'checked=''>"+d+"</label>");

							

}