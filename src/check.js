
function getMessage(a, b) {
	
	if (typeof a == "boolean") {
		
		return (a) ? "Я попал в " + b : "Я никуда не попал";
	}
	
	if (typeof a == "number") {
		
		return "Я прыгнул на " + (a * 100) + " сантиметров";
	}
	
	if (Array.isArray(a) && !Array.isArray(b)) {
		
		var numberOfSteps = a.reduce(function(x, y) { return x + y; });
		
		return "Я прошел " + numberOfSteps + " шагов";
	}
	
	if (Array.isArray(a) && Array.isArray(b)) {
		
		var distancePath = 0;
		
		for(var i = 0; i < a.length; i++) {
			distancePath += a[i] * b[i];
		}
		
		return "Я прошёл " + distancePath + " метров";
	}	
}
