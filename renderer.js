const http = require('http');

const searchButton = document.querySelector('#searchButton');
const searchField = document.getElementById('searchField');
const gifStream = document.getElementById('gif-stream');
const loadingGif = document.getElementById('loadingGif');

const ENTER_KEY_CODE = 13;
const TIME_TO_ABORT = 5000; 

searchButton.addEventListener('click', () => {
	SearchGiphy(searchField.value);
});

searchField.addEventListener('keypress', (event) => {
	if (event.keyCode === 13){
		SearchGiphy(searchField.value);
	}
});

function SearchGiphy(queryString){
	clearGIfs();
	toggleLoadingGif(true);
	term = encodeURIComponent(queryString);
	var address = "http://api.giphy.com/v1/gifs/search?q=" + term + '&api_key=dc6zaTOxFJmzC';
	var getReqt = http.get(address, (response)=>{
		response.setEncoding('UTF-8');
		let body = '';

		response.on('data', (d) => {
			body += d;
		});

		response.on('end', () => {
			toggleLoadingGif(false);
			let parsed = JSON.parse(body);
			for(let i = 0; i < parsed.data.length; i++){
				let temp = document.createElement('img');
				temp.src = parsed.data[i].images.fixed_height.url;
				gifStream.appendChild(temp);
			}
		});
	});

	getReqt.on('socket', (socket) => {
		socket.setTimeOut(TIME_TO_ABORT);
		socket.on('timeout', () => {
			getReqt.abort();
		});
	});

	getReqt.on('error', (err) => {
		let errorMsg = document.createElement('h1');
		if(err.code === "ECONNRESET"){
			console.log("timeout occurs");
			errorMsg.innerHTML = 'Connection Has Timed Out';
			document.body.appendChild(timeoutMsg);
		}else{
			console.log('Unknown http error');
		}
	});
};

function toggleLoadingGif(state){
	if(state){
		loadingGif.style.display = "block";
	}else{
		loadingGif.style.display = "none";
	}
}

function clearGIfs(){
	while(gifStream.hasChildNodes()){
		gifStream.removeChild(gifStream.lastChild);
	}
}

