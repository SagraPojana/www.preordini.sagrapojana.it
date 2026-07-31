function HashMap(){
   this.value = [];
   
   /**
      verifica se la mappa e' vuota
      @return true se la mappa e' vuota, false altrimenti
   */
   this.isEmpty = function(){
      return this.value.length == 0;
   };

   /**
      restituisce il numero di elementi contenuti nella mappa
      @return numero di elementi contenuti nella mappa
   */
   this.size = function(){
      return this.value.length;
   };

   /**
      restituisce il valore associato alla chiave specificata
      @param key la chiave associata al valore da restituire
      @return il valore associato alla chiave specificata, se presente,
              null se l'associazione non e' presente
      @throws IllegalArgumentException se key vale null
   */
   this.get = function(key){
      var value = this.remove(parseInt(key));
      if(value == undefined){
         return undefined;
      }
      this.put(parseInt(key), value);
      return value;
   }

   /**
      inserisce l'associazione key/value nella mappa. Se la chiave e' gia'
      presente, sostituisce l'associazione e restituisce il valore
      precedentemente associato alla chiave
      @param key la chiave
      @param value il valore da associare alla chiave
      @return il valore precedentemente associato alla chiave specificata, se
              presente, null se la chiave non e' gia' presente
      @throws IllegalArgumentException se key o value valgono null
   */
   this.put = function(key, value){
      /*var pos = binarySearch(this.value, key);
      if(pos >= 0)
         return;*/
      this.remove(parseInt(key));
      var entry = new Entry(parseInt(key), value);
      this.value[this.value.length] = entry;
      mergeSort(this.value);
      return entry.getValue();
   }
   
   /**
      elimina l'associazione con la chiave specificata
      @param key la chiave dell'associazione da eliminare
      @return il valore associato alla chiave specificata, se
              presente, null se la chiave non e' presente
      @throws IllegalArgumentException se key vale null
   */
   this.remove = function(key){
      var pos = binarySearch(this.value, parseInt(key));
      if(pos < 0){
         return undefined;
      }
      var val = this.value[pos].getValue();
      this.value.splice(pos,1);
      return val;
   }
   
   /**
      svuota l'hashmap.
   */
   this.makeEmpty = function(){
      this.value = [];
   }
   
   
   /**
      cerca un elemento e dice se è contenuto.
      @return true se lo trova, altrimenti false
   */
   this.contains = function(key){
      var pos = binarySearch(this.value, parseInt(key));
      return pos >= 0;
   }
   
   /**
      restituisce un array contenente le chiavi della mappa.
      @return array  contenente tutte le chiavi della mappa
   */
   this.keys = function(){
      var objs = [];
      for(var i = 0; i < this.value.length; i++)
         objs[objs.length] = parseInt(this.value[i].getKey());
      //alert(objs);
      return objs;
   }
   
   /**
      restituisce un array contenente tutti i valori della della mappa.
      @return array contenente tutti i valori della della mappa
   */
   this.toArray = function(){
      var objs = [];
      var allKeys = this.keys();
      for(var i = 0; i < allKeys.length; i++)
         objs[objs.length] = this.get(parseInt(allKeys[i]));
      return objs;
   }
   
   function mergeSort(a){
      if(a.length == 1)
         return;
      var mid = a.length / 2;
      var left = a.slice(0, mid);
      var right = a.slice(mid, a.length);
      mergeSort(left);
      mergeSort(right);
      merge(a, left, right);
   }
   
   function merge(a, b, c){
      var ia = 0, ib = 0, ic = 0;
      while(ib < b.length && ic < c.length){
         if(b[ib].getKey() < c[ic].getKey())
            a[ia++] = b[ib++];
         else
            a[ia++] = c[ic++];
      }
      while(ib < b.length)
         a[ia++] = b[ib++];
      while(ic < c.length)
         a[ia++] = c[ic++];
   }
   
   function binarySearch(array, searchElement) {
      var minIndex = 0;
      var maxIndex = array.length - 1;
      var currentIndex;
      var currentElement;
      while (minIndex <= maxIndex) {
         currentIndex = (minIndex + maxIndex) / 2 | 0;
         currentElement = array[currentIndex];
         if (currentElement.getKey() < searchElement)
            minIndex = currentIndex + 1;
         else if (currentElement.getKey() > searchElement)
            maxIndex = currentIndex - 1;
         else
            return currentIndex;
      }
      return -1;
   }
   
   function Entry(k, v){
      this.key = k;
      this.val = parseInt(v);
      
      this.getKey = function(){
         return this.key;
      }
      
      this.getValue = function(){
         return parseInt(this.val);
      }
      
      this.setKey = function(k){
         this.key = k;
      }
      
      this.setValue = function(v){
         this.val = parseInt(v);
      }
      
      this.getInfo = function(){
         return "(" + this.key + "," + this.val + ")";
      }
      /*
      Entry.prototype.toString = function(){
         return "(" + this.key + "," + this.val + ")";
      }*/
   }
   /*
   HashMap.prototype.toString = function(){
      if(this.isEmpty()){
         return "{}";
      }
      var str = "{";
      var entries = this.value;
      for(var i = 0; i < entries.length; i++){
         str += entries[i] + ",";
      }
      return str.substring(0, str.length - 1) + "}";
   }*/
}