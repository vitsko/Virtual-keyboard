var keys = [];
document.onkeydown = function(event){
  keys.push(event.code);
  console.log(event.code);
};