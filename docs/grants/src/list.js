
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
	.append("li"); 
	labels
	.append("input")
	.attr("checked", true)
	.attr("type", "checkbox")
	.attr("class", "cbox" +field)
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
		updateChecks();
		comeback = [];
		});

	labels.append("label").attr("class", "label" +field).text(d=>d);
}


function updateChecks() {

	var currentNames = getNameList(currentData);
	var currentDept = _.uniq(getDeptList(currentData));

	console.log(currentNames);
	console.log(currentDept);

   	d3.selectAll('input').property("checked", function(d){
   		
   		if(currentNames.indexOf(d) != -1 || currentDept.indexOf(d) != -1){
   			return true;
   		}

   		else{
   			return false;
   		}
   	});
}
