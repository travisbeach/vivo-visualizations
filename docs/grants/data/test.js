function getNameList(array){
	var nameList = [];
	array.forEach(function(d){
		var people = d.people; 

		var grantPeople = people.map(function(person){
			nameList.push(person.name);
			return person.name; 
		});
	});
	nameList = _.uniq(nameList);
	return nameList;
}

function getDeptList(array){
	return array.map(function(d){
		return d.dept.name;
	}); 
}

function getFundingAgency(array){
	return _.uniq(array.map(function(d){
		return d.funagen.name;
	})); 
}

$('#testInput').on('keyup', function() {
	var query = this.value.toLowerCase();

	$('.labelPerson').each(function(i, elem) {
		if (elem.innerHTML.toLowerCase().indexOf(query) != -1) {
			$(this).closest('label').show();
			$(this).prev().show();

		}else{
			$(this).closest('label').hide();
			$(this).prev().hide();
		}
	});


});
$('#deptInput').on('keyup', function() {
	var query = this.value.toLowerCase();

	$('.labelDepartment').each(function(i, elem) {
		if (elem.innerHTML.toLowerCase().indexOf(query) != -1) {
			$(this).closest('label').show();
			$(this).prev().show();

		}else{
			$(this).closest('label').hide();
			$(this).prev().hide();
		}
	});

});
$('#fundingInput').on('keyup', function() {
	var query = this.value.toLowerCase();

	$('.labelFunding.agency').each(function(i, elem) {
		if (elem.innerHTML.toLowerCase().indexOf(query) != -1) {
			$(this).closest('label').show();
			$(this).prev().show();

		}else{
			$(this).closest('label').hide();
			$(this).prev().hide();
		}
	});


});

function uncheckAll(){
	currentData = [];
	filtered = grants; 

	removedNames = getNameList(grants);

	update(currentData);
	updateChecks();
}

function checkAll(){
	currentData = grants; 
	removedNames = [];
	filtered = []; 
	update(currentData); 
	updateChecks();
}



