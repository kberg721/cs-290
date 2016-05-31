document.addEventListener('DOMContentLoaded', setUpPage);

function setUpPage() {
	
	attachFormFunctions();

	if(document.getElementById('newWorkoutBtn') != null) {
		document.getElementById('newWorkoutBtn').addEventListener('click', function(event){
		    var req = new XMLHttpRequest();
		    var payload = {};
		    payload.btn = "Add";
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
			      attachFormFunctions();
			    } else {
			      console.log("Error in network request: " + req.statusText);
			    }
			});
			req.send(JSON.stringify(payload));
		    event.preventDefault();
		});
	}

	if(document.getElementById('editWorkoutBtn') != null) {
		document.getElementById('editWorkoutBtn').addEventListener('click', function(event){
		    var req = new XMLHttpRequest();
		    var payload = {};
		    payload.btn = "Edit";
		    payload.id = document.getElementById('workoutID').value;
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
			       window.location.replace("http://52.37.58.94:3000/");
			    } else {
			      console.log("Error in network request: " + req.statusText);
			    }
			});
			req.send(JSON.stringify(payload));
		    event.preventDefault();
		});
	}
	
}

function attachFormFunctions() {
	var deleteBtns = document.getElementsByClassName("deleteBtn");
	var editBtns = document.getElementsByClassName("editBtn");
	for(var i = 0; i < deleteBtns.length; i++) {
		var listItem = deleteBtns[i];
		listItem.onclick = (function(item) {
			return function() {
				var req = new XMLHttpRequest();
			    var payload = {};
			    payload.btn = "Delete";
			    payload.id = item.parentElement.id.value;
			    req.open('POST', 'http://52.37.58.94:3000/', true);
			    req.setRequestHeader('Content-Type', 'application/json');
			    req.addEventListener('load',function(){
				    if(req.status >= 200 && req.status < 400){
				      var response = JSON.parse(req.responseText);
				      populateTable(response);
				      attachFormFunctions();
				    } else {
				      console.log("Error in network request: " + req.statusText);
				    }
				});
				req.send(JSON.stringify(payload));
			    event.preventDefault();
			};
		})(listItem);
	}
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
		date.innerHTML = rawString;
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
		input2.className = "deleteBtn";
		input2.type = "submit";
		input2.name = "delete";
		input2.value = "delete";
		delForm.appendChild(input1);
		delForm.appendChild(input2);
		del.appendChild(delForm);
		row.appendChild(del);

		var edit = document.createElement("td");
		var editForm = document.createElement("form");
		var input1 = document.createElement("input");
		input1.type = "hidden";
		input1.name = "id";
		input1.value = resp[i].id;
		var link = document.createElement("a");
		link.href = "http://52.37.58.94:3000/edit-data?id=" + resp[i].id;
		var input2 = document.createElement("input");
		input2.className = "editBtn";
		input2.type = "button";
		input2.name = "edit";
		input2.value = "edit";
		link.appendChild(input2);
		editForm.appendChild(input1);
		editForm.appendChild(link);
		edit.appendChild(editForm);
		row.appendChild(edit);

		body.appendChild(row);
	}
}








