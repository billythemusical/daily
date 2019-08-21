
/*
	simple example of iterating through all objects in a patch
*/

// set up inlets/outlets/assist strings
outlets = 5;
setoutletassist(0,"parent patcher name (symbol)");
setoutletassist(1,"begin (bang)");
setoutletassist(2,"box classname (symbol)");
setoutletassist(3,"box scripting name (list)");
setoutletassist(4,"box rect (list)");


function bang()
{
	outlet(4,"bang");
	this.patcher.apply(iterfun);
}

function iterfun(b)
{
	outlet(0, b.patcher.name);
	outlet(1, b.maxclass);
	outlet(2, b.varname);
	outlet(3, b.rect);
	
	return true;	
}
iterfun.local=1; // keep private