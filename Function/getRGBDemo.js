function getRGB(param) {
  return 'rgb(' + parseInt(param[1] + param[2], 16) + ', ' + 
          parseInt(param[3] + param[4], 16) + ', ' +  
          parseInt(param[5] + param[6], 16) + ')';
}
console.log(getRGB('#00ff00'));

console.log(getRGB('#00FF0f'));