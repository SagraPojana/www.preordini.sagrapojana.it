var default_stato_ordini = 'ordinato';
var aggiorna_ogni = 2; //valore in secondi

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function difftime(time_to_diff){
  var today = new Date().toLocaleDateString('en-US');
  var date1 = new Date(today + " " + time_to_diff);
  var date2 = new Date();

  var diff = date2.getTime() - date1.getTime();

  var msec = diff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;

  //return { hh: hh, mm: mm, ss:ss };
  return ((hh * 60) + mm );
}

function RequestAndUpdate(){

	var append_url = '';
	stato_ordini = getUrlParam('stato',default_stato_ordini);
	reparto = getUrlParam('reparto','');

	if(reparto != ''){
		append_url = '&reparto='+reparto;
	}

	$.ajax({
	  url: "/rest/monitor_cucina?stato="+stato_ordini+append_url,
	  method: "GET",
    cache: false,
	  dataType: "json"
	}).success(function(response) {
    jQuery('.hiddenBlock').removeClass('toogled');
		$('#tabledata').html(''); //clean table data
			data = response;
			for( i in data){
				if(data[i].reparto == 'cliente') continue;
				reparto = data[i].reparto;
				reparto_data = data[i].quantita_e_descrizioni;
				for( k in reparto_data){
					descrizione = reparto_data[k].descrizione;
					sum = reparto_data[k].quantita;
					aspetta_da = difftime(reparto_data[k].ora.split(".", 1));
					desc_tipologia = reparto_data[k].desc_tipologia;
					html ='<tr>';
					html =html+'<td>'+desc_tipologia+'</td>';
					html =html+'<td>'+descrizione+'</td>';
					html=html+'<td>'+sum+'</td>';
					html=html+'<td>'+aspetta_da+' minuti</td>'
					html=html+'</tr>';
					$('#tabledata').append(html);
				}
			}
	})
  .error(function(XMLHttpRequest, textStatus, errorThrown) {
        jQuery('.hiddenBlock').addClass('toogled');
    });

	timeoutID = setTimeout(RequestAndUpdate, aggiorna_ogni*1000); //esegui ogni N sec
}

RequestAndUpdate();
