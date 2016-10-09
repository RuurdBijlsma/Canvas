document.addEventListener('DOMContentLoaded', init, false);

function init() {
    CANVAS = new Canvas(document.getElementById('renderer'));

    fetch('file.txt').then(function(resp){
    	resp.text().then(function(text){
    		console.log(text);
    	});
    });
}
