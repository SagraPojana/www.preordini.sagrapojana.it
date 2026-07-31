function QRCodeManager(qrCode){
   this.qrcode = qrCode;
   
   this.makeQRCode = function(text) {		
      this.qrcode.makeCode(text);
   }
   
   this.clear = function(){
      this.qrcode.clear();
   }
}
