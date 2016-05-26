document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
	document.getElementById('newWorkOutButton').addEventListener('click', function(event){
    var req = new XMLHttpRequest();

    req.open('POST', 'http://localhost:3000', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
	    if(req.status >= 200 && req.status < 400){
	      var response2 = JSON.parse(req.responseText);
	      console.log(response2);
	    } else {
	      console.log("Error in network request: " + request2.statusText);
	    }
	});
    req2.send(null);
    event.preventDefault();



	});
}