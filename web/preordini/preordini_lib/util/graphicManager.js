function GraphicManager(){

   this.setButtonPlusMinus = function(hashmap){
      var dataManager = new Data();
      for(var i = 0; i < elencoPrincipale.length; i++){
         var pietanze = elencoPietanze[elencoPrincipale[i]];
         for(var j = 0; j < pietanze.length; j++){
            var pietanza = pietanze[j];
            $("#plus" + pietanza.id).click(function() {
               var id = (this.id).substring("plus".length);
               var quantitaHtml = $("#quantita" + id);
               var quantita = parseInt(quantitaHtml.html()) + 1;
               quantitaHtml.html(quantita + "");
               var hashmap = dataManager.getInstanceHashmap();
               hashmap.put(id, quantita);
               dataManager.saveInstanceHashmap(hashmap);
            });
            $("#minus" + pietanza.id).click(function() {
               var id = (this.id).substring("minus".length);
               var quantitaHtml = $("#quantita" + id);
               var quantita = Math.max(parseInt(quantitaHtml.html()) - 1, 0);
               quantitaHtml.html(quantita + "");
               var hashmap = dataManager.getInstanceHashmap();
               if(quantita > 0){
                  hashmap.put(id, quantita);
               }else{
                  hashmap.remove(id);
               }
               dataManager.saveInstanceHashmap(hashmap);
            });
         }
      }
   }

   this.generatePopup = function(id, dataElimina){
      var info;
      var title;
      
      var isElimina = dataElimina.value;
      
      if(isElimina){
         title = "Elimina Ordine";
         if(dataElimina.state == 0){
            info = "<p>Nessuna pietanza selezionata.</p>";
            info += "<p>Per effettuare un ordine devi almeno selezionare una pietanza.</p>";
         }else{
            info = "<p>L'ordine &egrave; stato eliminato.</p>";
            info += "<p>Le quantit&agrave; di tutte le pietanze sono state azzerate.</p>";
         }
      }else{
         title = "Ordine Vuoto";
         info = "<p>Il tuo ordine &egrave; vuoto.</p>" + 
                "<p>Devi almeno ordinare una pietanza</p>" + 
                "<button class=\"ui-btn green-btn\" id=\"ordine-vuoto-btn\">Ok</button>"
      }
      
      $("#title-popup").html(title);
      $("#info-ordine-popup").html(info);
      
      if(!isElimina){
         $("#ordine-vuoto-btn").click(function(evt) {
            $(id).popup("close");
         });
      }else{
         var timeout = setTimeout(
            function(){
               $(id).popup("close");
            },
            4500
         );
         $(id).on({
            popupafterclose: function() {
               clearTimeout(timeout);
            }
         });
         //$( document ).on( "pageinit", function() {
         //});
      }
      
      $(id).popup({ dismissible: isElimina });
   }

   this.generateResoconto = function(hashmap, dict){
      
      function getPietanza(id){
         for(var i = 0; i < elencoPrincipale.length; i++){
            var pietanze = elencoPietanze[elencoPrincipale[i]];
            for(var j = 0; j < pietanze.length; j++){
               if(pietanze[j].id == id){
                  return {
                     pietanza : pietanze[j],
                     tipo : elencoPrincipale[i]
                  };
               }
            }
         }
         return undefined;
      }
      
      function getTextPietanza(nome, prezzoUnitario, quantita){
         var prezzo = (prezzoUnitario * quantita);
         return "<div class=\"content-pietanza-riepilogo\">" + 
                  "<div class=\"left nome-pietanza\">" + nome + "</div>" + 
                  "<div class=\"center quantita-pietanza-riepilogo\">" + quantita + "</div>" + 
                  "<div class=\"right prezzo-pietanza-riepilogo\">" + setTextPrezzo(prezzo) + "</div>" + 
                  "<div class=\"endBlock\"></div>" + 
               "</div>";
      }
      
      function getTextTipo(tipo){
         return "<div class=\"tipo-pietanza-riepilogo\">" +
                     tipo +
                 "</div>";
      }
      
      var txtResoconto = 
						"<div class=\"cliente-riepilogo\">" +
                           "<div class=\"left nome-cliente\"><b>Nome Cliente:</b> " +  dict['nomecliente'] +"</div>" +
                           "<div class=\"center numerotavolo\"><b>Tavolo:</b> " +  dict['tavolo'] +"</div>" +
                           "<div class=\"right coperti\"><b>Coperti:</b>" +  dict['coperti'] +"</div>" +
                           "<div class=\"endBlock\"></div>" +
                        "</div>" +	  
	  
	  
						"<div class=\"title-pietanze-riepilogo\">" +
                           "<div class=\"left nome-pietanza\">Nome</div>" +
                           "<div class=\"center quantita-pietanza-riepilogo\">Quantit&agrave;</div>" +
                           "<div class=\"right prezzo-pietanza-riepilogo\">Prezzo</div>" +
                           "<div class=\"endBlock\"></div>" +
                        "</div>";
		
	  
      var allKeys = hashmap.keys();
      
      var data = hashmap.toArray();
      var totale = {prezzo : 0, quantita : 0};
      var allPietanze = [];
      for(var i = 0; i < allKeys.length; i++){
         allPietanze[allPietanze.length] = getPietanza(allKeys[i]);
      }
      
      allPietanze.sort(
         function(a, b){
            function getIndex(p){
               for(var i = 0; i < elencoPrincipale.length; i++){
                  if(elencoPrincipale[i] == p.tipo){
                     return p.pietanza.posizione;
                  }
               }
               return -1;
            }
            return getIndex(a) - getIndex(b);
         }
      );
         
      var tipo = allPietanze[0].tipo;
      txtResoconto += getTextTipo(tipo);
      for(var i = 0; i < allPietanze.length; i++){
         var pietanza = allPietanze[i].pietanza;
         if(tipo != allPietanze[i].tipo){
            tipo = allPietanze[i].tipo;
            txtResoconto += getTextTipo(tipo);
         }
		 qta = hashmap.get(pietanza.id)
         txtResoconto += getTextPietanza(pietanza.nome, pietanza.prezzo, qta);
         totale.prezzo += pietanza.prezzo * qta;
         totale.quantita += qta;
      }
      return txtResoconto + "<div class=\"content-totale-ordine-riepilogo\">" + 
                              "<div class=\"left nome-pietanza\"><b>Totale: </b></div>" + 
                              "<div class=\"center quantita-pietanza-riepilogo\">" + totale.quantita + "</div>" + 
                              "<div class=\"right prezzo-pietanza-riepilogo\">" + setTextPrezzo(totale.prezzo) + "</div>" + 
                              "<div class=\"endBlock\"></div>" + 
                           "</div>";
   }
   
   this.generateMenu = function(hashmap){
      function generatePietanza(id, nome, prezzo, quantita){
         return "<div class=\"content-pietanza-ordine\">" +
                  "<div class=\"left nome-pietanza\">" +
                     nome +
                  "</div>" +
                  "<div class=\"center prezzo-pietanza-ordine\">" +
                     setTextPrezzo(prezzo) +
                  "</div>" +
                  "<div class=\"right\">" +
                     "<div class=\"left minus\" >" +
                        "<button data-mini=\"false\" data-inline=\"true\" class=\"ui-btn brown-btn minus-btn\" id=\"minus" + id + "\">-</button>" +
                     "</div>" +
                     "<div class=\"center quantita-pietanza-ordine\">" +
                        "<span id=\"quantita" + id + "\">" + quantita + "</span>" + 
                     "</div>" +
                     "<div class=\"right plus\">" +
                        "<button data-mini=\"false\" data-inline=\"true\" class=\"ui-btn brown-btn plus-btn\" id=\"plus" + id + "\">+</button>" +
                     "</div>" +
                  "</div>" +
                  "<div class=\"endBlock\"></div>" +
               "</div>";
      }
      var txtLista = "<div> " + 
						"<input type='text' id='nomecliente' placeholder='Inserisci il tuo nome'/>" +
						"<input type='text' id='tavolo' placeholder='Inserisci il numero del tavolo'/>" +
						"<input type='text' id='coperti' placeholder='Quanti siete &#63;'/>" +
					"</div>"
						
      
      for(var i = 0; i < elencoPrincipale.length; i++){
         txtLista += "<div data-role='collapsible'>" + 
                     "<h4>" + elencoPrincipale[i] + "</h4>";
         var pietanze = elencoPietanze[elencoPrincipale[i]];
         for(var j = 0; j < pietanze.length; j++){
            var pietanza = pietanze[j];
            pietanza.nome = pietanza.descrizione;
            var quantita = hashmap.contains(pietanza.id) ? hashmap.get(pietanza.id) : 0;
            txtLista += generatePietanza(pietanza.id, pietanza.nome, pietanza.prezzo, quantita);
         }
         txtLista += "</div>";
      }
      return txtLista;
   }
   
   function setTextPrezzo(prezzo){
      function isInt(n) {
         return n % 1 === 0;
      }
      if(isInt(prezzo)){
         return prezzo + ",00 Euro";
      }else{
         prezzoString = prezzo + "";
         prezzoString = prezzoString + (prezzoString.split(".")[1].length == 1 ? "0" : "");
         return prezzoString.replace(".", ",") + " Euro";
      }
   }
}