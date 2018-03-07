var PythonShell = require('python-shell');
var availableSeats = 50;
var idsFromCloud = [1,2,3,4];
var idsOnBus=[0];
var coming ;
var allowed = ' '
var counter = 1;
var onStation = true;
var availableSeats = 50;
var gpio = require('rpi-gpio');
gpio.setup(3 , gpio.DIR_IN);
gpio.setup(5 , gpio.DIR_IN );
gpio.setup(7 , gpio.DIR_IN);
var x = 0;


// start loop 
setInterval(() => {

counter = counter + 1 ;

//Check bus arrival
/*
function checkArrival() {
	gpio.read(7,function(err,value){
	if (err) console.log("can not reach pin 7");
	if (value == true) {
		onStation = true;
		console.log('Bus arrived');
	}
	else {
		counter = 0;
		onStation = false;
	}
});
}
*/
//if bus arrived : 
if (onStation == true){

//IR 1 Readings
	gpio.read(3,function(err,value){
	if (err) console.log(err);
	if (value == false){ 	x = x+1; }
	else x= 0;
   });
 
 //IR2 Readings
	gpio.read(5,function(err,value){
	if (err) console.log("can not reach pin 5");
	if (value == false) {  x=x+1; }
	else x=0;
   });
   
   //Check if the two IRs are high
	if (x==2)
	availableSeats = availableSeats + 1 ;

//scan QR every 5 second
if (counter == 5){
counter = 0 ;

// get image 
PythonShell.run('getImage.py', function (err,data) {
  if (err) throw err;
  console.log(data);
});

// decode QR code in image
var fs = require('fs');
var Jimp = require("jimp");
var QrCode = require('qrcode-reader');
var buffer = fs.readFileSync('/home/pi/hardware/test1');
Jimp.read(buffer, function(err, image) {
    if (err) { console.log(" ");    }
    var qr = new QrCode();
    qr.callback = function(err, value) {
        if (err) {  console.error(" ");      }
	
  //if the cam reads no QR but a dummy value
  if (value == null) 
		value  = { result: '10'};
    
	coming = value.result;
    };
    
    qr.decode(image.bitmap);
	var j=0;
	for (var i =0 ; i<4  ; i++)
	{	
		if (j < idsOnBus.length ) j++;
		
    //if coming id = the dummy value do nothing
    if (coming == 10) {
			allowed = ' ';
			break;}
      
      //if the coming id is already on Bus
		else if (coming == idsOnBus[j]) 
		{
			allowed = 'Already Signed';
			break;
		}
    
    //if the coming id equals to the one sent by cloud
		else if (coming == idsFromCloud[i])
		{
			availableSeats = availableSeats -1 ;
			idsOnBus.push(coming);
			allowed = 'Allowed';
			break;	
		}
    
		else allowed= 'Not Allowed';
	}
	console.log(allowed);
});

}//end of if counter = 5

console.log('Available Seats = ' + availableSeats);

} // end ofif bus arrived 

},1000) 

