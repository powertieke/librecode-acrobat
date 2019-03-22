code128Encoder = function()
{
	function isDigit(char)
	{
		if (char == undefined) {
			return false;
		}
		charCode = char.charCodeAt();
		return (charCode <= 57 && charCode >= 48);
	}
	function filterInput(value)
	{
		return value;
	}
	
	function encodeWithStart(startCode, value)
	{
		var encodedValue = [];
		if (startCode == "A") {
			currentCode = "A";
			encodedValue[0] = 103;
		} else if (startCode == "B") {
			currentCode = "B";
			encodedValue[0] = 104;
		} else if (startCode == "C") {
			currentCode = "C";
			encodedValue[0] = 105;
		}
		
		for (var i = 0; i < value.length; i++) {
			switch (currentCode){
			case "C":
				if ( isDigit(value[i]) && isDigit(value[i+1]) ) {
					var encodedDoubleDigit = parseInt(value.substring(i, i+2));
					encodedValue.push(encodedDoubleDigit);
					i++;
				} else if (value[i].charCodeAt() == 202) {
					encodedValue.push(102);
				} else {
					currentCode = "B";
					encodedValue.push(100);
					i--; // So the loop will retry for code B
				}
				break;
				
			case "B":
				if ( 	isDigit(value[i]) && 
							isDigit(value[i+1]) && 
							isDigit(value[i+2]) && 
							isDigit(value[i+3]) ) {
					currentCode = "C";
					encodedValue.push(99);
					i--;
				} else if (value[i].charCodeAt() == 202) {
					encodedValue.push(102);
				} else {
					for (var i1 = 0; i1 < data.length; i1++) {
						if (value[i] == data[i1][2]) {
							encodedValue.push(data[i1][0]);
						}
					}
				}
				break;
			} 
		}
		
		encodedValue.push(calculateChecksum(encodedValue));
		encodedValue.push(206);
		
		
		
		return encodedValue;
	}
	
	function calculateChecksum(encodedValue) {
		var sum = 0;
		for (var i = 0; i < encodedValue.length; i++) {
			var times = i != 0 ? i : 1;
			sum = sum + (times * encodedValue[i]);
		}
		
		return sum % 103;
	}
	
	function codeToStringForFont(code)
	{
		var outputString = "";
		for (var i = 0; i < code.length; i++) {
			for (var i1 = 0; i1 < data.length; i1++) {
				if (code[i] == data[i1][0]) {
					outputString = outputString + data[i1][4];
				}
			}
		}
		
		return outputString;
	}
	
	function encode(value)
	{
		value = filterInput(value);
		var paths = [
			encodeWithStart("B", value),
			encodeWithStart("C", value)
		];
		shortest = paths[0].length < paths[1].length ? paths[0] : paths[1];
		console.println(shortest);
		console.println(shortest.length);
		console.println(codeToStringForFont(shortest));
		console.println(codeToStringForFont(shortest).length);
		return codeToStringForFont(shortest);
		
	}
	
	return {encode : encode};
	
}();
