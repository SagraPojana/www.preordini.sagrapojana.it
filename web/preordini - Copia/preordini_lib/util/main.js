$(document).on("pagecreate",function(event){
   
   var graphicManager = new GraphicManager();
   var dataManager = new Data();  
     
   $(document).on("pagebeforeshow","#pageprinc",function(){
      
      $("#lista").empty().append(
         graphicManager.generateMenu(
            dataManager.getInstanceHashmap()
         )
      ).collapsibleset();
      
      $("#lista").trigger("create");
      
      graphicManager.setButtonPlusMinus();
      
      $("#resoconto-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         var hashmap = dataManager.getInstanceHashmap();
         if(hashmap.isEmpty()){
            graphicManager.generatePopup(
               "#popup-ordine",
               {value: false}
            );
            $("#popup-ordine").popup("open");
         }
         else{
            dataManager.saveInstanceHashmap(hashmap);
            $.mobile.pageContainer.pagecontainer("change", "#pageres", {});
         }
      });
      
      $("#elimina-ordine-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         var txt;
         var dataElimina = {value: true, state: 0};
         
         var hashmap = dataManager.getInstanceHashmap();
         if(!hashmap.isEmpty()){
            dataElimina.state = 1;
            hashmap.makeEmpty();
            dataManager.saveInstanceHashmap(hashmap);
            hashmap = dataManager.getInstanceHashmap();
            for(var i = 0; i < elencoPrincipale.length; i++){
               var pietanze = elencoPietanze[elencoPrincipale[i]];
               for(var j = 0; j < pietanze.length; j++){
                  var id = pietanze[j].id;
                  var quantitaHtml = $("#quantita" + id);
                  var quantita = hashmap.contains(id) ? hashmap.get(id) : 0;
                  quantitaHtml.html(quantita + "");
               }
            }   
         }

         graphicManager.generatePopup(
            "#popup-ordine",
            dataElimina
         );
         
         $("#popup-ordine").popup( "open");

      });   
   });
   
   $(document).on("pagebeforeshow","#pageres",function(){ 
      var hashmap = dataManager.getInstanceHashmap();
      if(hashmap.isEmpty()){
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         return;
      }
		var dict = {};
	  dict['nomecliente'] =  $('#nomecliente').val();
	  dict['coperti'] = $('#coperti').val();
	  dict['tavolo'] = $('#tavolo').val();
	  
      $("#resoconto").html(
         graphicManager.generateResoconto(
            hashmap, dict
         )
      );
      $("#modifica-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
      });
      $("#conferma-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         $.mobile.pageContainer.pagecontainer("change", "#pageqrcode", {});
      });
   });
   
   $(document).on("pagebeforeshow","#pageqrcode",function(){ 
      /**
      function generateTextQRCode(hashmap){
		 var nomecliente = $('#nomecliente').val();
		 var numerotavolo = $('#tavolo').val();
		 var numerocoperti = $('#coperti').val();
		 
         var obj = 'numerotavolo:::' + numerotavolo + ';;;cliente:::' + encodeURIComponent(nomecliente) + ';;;coperti:::' + numerocoperti + ';;;';    //{numeroTavolo:numerotavolo,cliente:nomecliente,coperti:numerocoperti,righe:[]};
         var keys = hashmap.keys();
         for(var i = 0; i < keys.length; i++){
			obj = obj + 'id:::' + parseInt(keys[i]) + ';;;qta:::' + hashmap.get(keys[i]) + ';;;';

         }
         return obj;
      }
	  */
	  function generateTextQRCode(hashmap){
		 var nomecliente = $('#nomecliente').val();
		 var numerotavolo = $('#tavolo').val();
		 var numerocoperti = $('#coperti').val();
		 
         var obj = {numeroTavolo:numerotavolo,cliente:nomecliente,coperti:numerocoperti,righe:[]};
         var keys = hashmap.keys();
         for(var i = 0; i < keys.length; i++){
            obj.righe.push({id:parseInt(keys[i]),qta:hashmap.get(keys[i])});
         }
         return encodeURIComponent(JSON.stringify(obj));
      }
      
      var hashmap = dataManager.getInstanceHashmap();
      
      if(hashmap.isEmpty()){
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         return;
      }
      
      $("#nuovo-ordine-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         dataManager.saveInstanceHashmap(new HashMap());
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
      });
      
      $("#qrcode").html("");
      var qrcode = new QRCode(
         document.getElementById("qrcode"),
         {
            width: 100,
            height: 100,
            useSVG: true
         }
      );
         
      var qrCodeManager = new QRCodeManager(qrcode);
      qrCodeManager.clear();
      qrCodeManager.makeQRCode(generateTextQRCode(hashmap));
   });

});