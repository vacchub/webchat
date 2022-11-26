const STX = 0xfe;
const data = "abcd";

const str = String.fromCharCode(STX) + String.fromCharCode(STX) + String(data.length).padStart(5, "0") + data;

if (str[0] == String.fromCharCode(STX))
console.log("GOOD");
else
console.log("bad");


console.log(data.charAt(0));
console.log(data.charAt(1));
console.log(str.length);
console.log(str);

