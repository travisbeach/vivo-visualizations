
/*Coverts an array into a Set (no duplicates)*/
let unique = a => [...new Set(a)];

/*Extracts property and returns list of those properties without duplicates*/
function getProperty(array, property){
	return unique(array.map(d=>d[property]));
}
/*Adds a checkbox for each member of the list*/
function addList(id, array, field){ 
	var anchorDiv = d3.select(id); 
	var labels = anchorDiv.selectAll("div")
	.data(array.sort())
	.enter()
	.append("label")
	.text(function(d) { return d; })
	.append("input")
	.attr("checked", true)
	.attr("type", "checkbox")
	.attr("class", "cbox")
	.attr("id", function(d,i) { return i; })
	.attr("for", function(d,i) { return i; })
	.on("change", function(d){
		var bool = d3.select(this).property("checked");
		if(bool == false){
			currentData = currentData.filter(function(node){
				if(node[field] != d){
					return true;
				}
				else{
					filtered.push(node); 
				}
			}); 
		}

		else{
			filtered = filtered.filter(function(node){
				if(node[field] == d){
					comeback.push(node);
					return false;
					}
				else{
					return true;
				}
				});	

			currentData = currentData.concat(comeback);
		}


		update(currentData);
		comeback = [];
		});
}

function updateChecks(){
	var checks = d3.selectAll(".cbox");
	checks[0].forEach(function(d){
		console.log(d.__data__);
	})

}

