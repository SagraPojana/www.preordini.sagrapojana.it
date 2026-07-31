//1234
var elencoPrincipale = [];
var categorie = []


var elencoPietanze = [];

function popolaTipologie() {
    $.ajax({
      url: "/rest/tipologie",  	  
      async: false,
      success: function(data) {
         categorie = data; 
		 for (var i=0; i<categorie.length; i++){
			elencoPrincipale.push(categorie[i].descrizione);
		 }
		 
      }
   });
}



popolaTipologie();



function popolaArticoli() {
	for (var i=0; i<categorie.length; i++){
	$.ajax({
	  url: "/rest/articoli_per_tipologia/" + categorie[i].id,  
	  async: false,
	  success: function(data) {
			elencoPietanze[elencoPrincipale[i]] = data;
			console.log(elencoPietanze);
	  }
	});	 



	}

	 
}

popolaArticoli();
	


function Data(){
   
   var riferimentoHashMap = "_hashmap";
   var riferimentoCoperti = "_coperti";
   
   this.getInstanceHashmap = function(){
      function recreateHashmap(value){
         var hashmap = new HashMap();
         for(var i = 0; i < value.length; i++){
            hashmap.put(value[i].key, value[i].val);
         }
         return hashmap;
      }
      
      var hashmap = $.cookie(riferimentoHashMap);
      if(typeof hashmap !== 'undefined' && hashmap !== null){  //esiste
         return recreateHashmap(JSON.parse(hashmap).value);
      }else{
         hashmap = new HashMap();
         this.saveInstanceHashmap(hashmap);
         return hashmap;
      }
   }
   
   this.saveInstanceHashmap = function(hashmap){
      $.cookie(
         riferimentoHashMap,
         JSON.stringify(hashmap)
      );
   }
   
   this.getInstanceCoperti = function(){
      var coperti = $.cookie(riferimentoCoperti);
      if(typeof coperti !== 'undefined' && coperti !== null){  //esiste
         return parseInt(coperti);
      }else{
         return 1;
      }
   }
   
   this.saveInstanceCoperti = function(coperti){
      $.cookie(
         riferimentoCoperti,
         coperti
      );
   }
   
   var rootURL = "/rest/";
   

	
}