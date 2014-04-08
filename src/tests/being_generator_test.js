var BeingObjectGenerator = require('../classes/BeingObjectGenerator');

var beingObjGenerator = new BeingObjectGenerator();
beingObjGenerator.getBeingObject('data/corpuses/cory_feder', function(beingObj){
	console.log(beingObj);
});