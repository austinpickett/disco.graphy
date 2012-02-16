$(document).ready(function() {
	// removes any validation message if no poster present
	$('#term').focus(function() {
		var full = $('#poster').has('img').length ? true : false
		if(full == false) {
			$('#poster').empty();
		}
	});

	var getPoster = function(){
		//grab movie title and store it.
		var film=$('#term').val();
		film.replace(" ","+");
		var apikey='4958eb7f6ab4905b7532ab77fa9edc62';
		//check if user has anything entered.
		if(film==''){
			// if input field =empty.. display a message
			$('#poster').html("<h2 class='loading'>Please Enter something in the form.</h2>");
		} else {
			//must have entered value carry on with API call
			
			$('#poster').html("<h2 class='loading'>Image on its way.</h2>");	

			$.getJSON("http://ws.audioscrobbler.com/2.0/?method=artist.search&artist="+film+"&api_key="+apikey+"&format=json", function(data) {
				if(data!=''){
					$('#poster').html('<h2 class="loading">Found yer image</h2><p>' +data.results.artistmatches.artist[0].name+ '</p><p><img src="'+data.results.artistmatches.artist[0].image[2]['#text']+'" /></p><p>');

				console.log(data.results.artistmatches.artist[0]);

				film=data.results.artistmatches.artist[0].name;

				$.getJSON("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+film+"&limit=10&api_key="+apikey+"&format=json", function(data) {
					    $('#poster').append('<h2 class="loading">Top Albums</h2><ul style="text-align: left">');
						$.each(data.topalbums.album, function(i, item) {
						$('#poster').append('<li>'+item.name+ '</li>');
					});
					$('#poster').append('</ul>');
				});
				} else {
					$('#poster').append('<h2 class="loading">Sorry.. couldn\'t find it..</h2>');
				}
			});
			
		}
		return false;
	}
	$('#search').click(getPoster);
	$('#term').keyup(function(event) {
		if(event.keyCode==13){
			getPoster();
		}
	});
});