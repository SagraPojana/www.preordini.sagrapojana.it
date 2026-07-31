
var default_stato_ordini = 'lavorazione';
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

function RequestAndUpdate(){
	
	var append_url = '';
	stato_ordini = getUrlParam('stato',default_stato_ordini);
	reparto = getUrlParam('reparto','');
	
	if(reparto != ''){
		append_url = '&reparto='+reparto;
	}
	
	$.ajax({
	  url: "/rest/progressivi_monitor_ordini?stato="+stato_ordini+append_url,
	  method: "GET",
	  dataType: "json"
	}).success(function(response) {
	jQuery('.hiddenBlock').removeClass('toogled');
		
			data = response;
			//data = eval('[{"reparto": "cucina", "progressivi": [1,6]},{"reparto": "pizzeria", "progressivi": [14,16]}]');
			for( i in data){
				reparto = data[i].reparto;
				progressivi = data[i].progressivi;
				$('#'+reparto).show();
				if(progressivi.length > 0){
					$('#'+reparto+'_no').html(progressivi.join(' - '));
				}
				else{
					$('#'+reparto+'_no').html('-');
				}
			}
			
			if($('[name=reparto]:visible').length == 1){
				$('[name=reparto]:visible').css('width','100%');
			}
		
	})
	  .error(function(XMLHttpRequest, textStatus, errorThrown) {
        jQuery('.hiddenBlock').addClass('toogled');
    });
	
	setTimeout(RequestAndUpdate, aggiorna_ogni*1000); //esegui ogni N sec
}

RequestAndUpdate();