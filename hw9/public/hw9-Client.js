document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
	document.getElementById('newWorkout').addEventListener('submit', function(event){
    var req = new XMLHttpRequest();

    console.log("hello");
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
    req.send(null);
    event.preventDefault();
	});
}