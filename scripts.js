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
		var album_id;
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
					$('#poster').html('<p>' +data.results.artistmatches.artist[0].name+ '</p><p><img src="'+data.results.artistmatches.artist[0].image[2]['#text']+'" /></p><p>');

				console.log(data.results.artistmatches.artist[0]);

				film=data.results.artistmatches.artist[0].name;
				
				$.getJSON("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+film+"&limit=3&api_key="+apikey+"&format=json", function(data) {
					    $('#poster').append('<h2 class="loading">Top Albums</h2>');

						$.each(data.topalbums.album, function(i, item) {
						album_id=item.name;
						$('#poster').append('<div class="album_'+i+'"><figure><img class="album_" src="'+item.image[2]['#text']+ '" /><figcaption>'+album_id+'</figcaption></figure></div>');
						if(i==3){$('#poster').append('<div class="clearfix"> </div>')}
							$.getJSON("http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key="+apikey+"&artist="+film+"&album="+item.name+"&format=json", function(data) {
								$.each(data.album.tracks, function(y, albitem) {
									$.each(albitem, function(x,tracks) {
										$.getJSON("http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key="+apikey+"&artist="+film+"&track="+tracks.name+"&format=json", function(data) {
												console.log(data);
												$('.album_'+i).append('<p>'+(x+1)+") <a href='#' onClick=\"window.open('http://play.last.fm/preview/" +data.track.id+ ".mp3','','width=300,height=200,location=0,menubar=0,scrollbars=0,status=0,toolbar=0,resizable=0')\">" +tracks.name+'</a></p>');
											});
										console.log(tracks.id);
									});
									
								});
									
							});
					});

					$('#poster').append('');
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