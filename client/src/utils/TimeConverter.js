const timeConverter = (timestamp) => {
  var a = new Date(timestamp * 1);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = `${a.getDate()}`.padStart(2, "0");
  var hour = `${a.getHours()}`.padStart(2, "0");
  var min = `${a.getMinutes()}`.padStart(2, "0");
  var sec = `${a.getSeconds()}`.padStart(2, "0");
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

export default timeConverter;