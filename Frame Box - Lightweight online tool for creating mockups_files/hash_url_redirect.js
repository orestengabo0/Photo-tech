String.prototype.startsWith = function(str) {
  return (this.match("^"+str)==str);
};

function redirect_if_hash() {
  var current_hash = document.location.hash;
  if (current_hash.startsWith('#!/')) {
    window.location = current_hash.substr(3);
  }
}
