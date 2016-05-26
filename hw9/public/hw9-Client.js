document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
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
		      console.log(response);
		    } else {
		      console.log("Error in network request: " + request.statusText);
		    }
		});
		console.log(JSON.stringify(payload));
		req.send(JSON.stringify(payload));
	    event.preventDefault();
	});
}