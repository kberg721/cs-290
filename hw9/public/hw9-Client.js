document.addEventListener('DOMContentLoaded', setUpPage);

function setUpPage() {
	
	document.getElementById('newWorkoutBtn').addEventListener('click', function(event){
	    var req = new XMLHttpRequest();
	    var payload = {};
	    payload.name = document.getElementById('workoutName').value;
	    payload.reps = document.getElementById('workoutReps').value;
	    payload.weight = document.getElementById('workoutWeight').value;
	    payload.date = document.getElementById('workoutDate').value;
	    if(document.getElementById('lbsCheck').checked) {
	    	payload.unit = "lbs";
	    } else {
	    	payload.unit = "kgs";
	    }
	    req.open('POST', 'http://52.37.58.94:3000/', true);
	    req.setRequestHeader('Content-Type', 'application/json');
	    req.addEventListener('load',function(){
		    if(req.status >= 200 && req.status < 400){
		      var response = JSON.parse(req.responseText);
		      populateTable(response);
		    } else {
		      console.log("Error in network request: " + req.statusText);
		    }
		});
		req.send(JSON.stringify(payload));
	    event.preventDefault();
	});
}

function populateTable(resp) {
	var body = document.getElementById("tableBody");
	body.innerHTML = "";
	for(var i = 0; i < resp.length; i++) {
		var row = document.createElement("tr");

		var name = document.createElement("td");
		name.innerHTML = resp[i].name;
		row.appendChild(name);

		var reps = document.createElement("td");
		reps.innerHTML = resp[i].reps;
		row.appendChild(reps);

		var weight = document.createElement("td");
		weight.innerHTML = resp[i].weight;
		row.appendChild(weight);

		var date = document.createElement("td");
		var rawString = resp[i].date;
		var refinedDate = "";
		refinedDate += rawString.substring(0, 4);
		refinedDate = rawString.substring(8, 10) + "-" + refinedDate;
		refinedDate = rawString.substring(5, 7) + "-" + refinedDate;
		date.innerHTML = refinedDate;
		row.appendChild(date);

		var lbs = document.createElement("td");
		var unit = resp[i].lbs;
		if(unit == 1) {
			lbs.innerHTML = "lbs";
		} else {
			lbs.innerHTML = "kgs";
		}
		row.appendChild(lbs);

		var del = document.createElement("td");
		var delForm = document.createElement("form");
		var input1 = document.createElement("input");
		input1.type = "hidden";
		input1.name = "id";
		input1.value = resp[i].id;
		var input2 = document.createElement("input");
		input2.type = "submit";
		input2.name = "delete";
		input2.value = "delete";
		delForm.appendChild(input1);
		delForm.appendChild(input2);
		del.appendChild(delForm);

		body.appendChild(row);
	}
}








