
function myFunction() {
    let x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
      x.className += " responsive";
      let y = document.getElementsByClassName('responsive')
    } else {
      x.className = "navbar";
    }
}

// Add click event listeners to the navigation links
let navLinks = document.querySelectorAll(".navbar a");
navLinks.forEach(function(link) {
  link.addEventListener("click", function() {
    // Remove the 'active' class from all links
    navLinks.forEach(function(otherLink) {
      otherLink.classList.remove("active");
    });
    // Add the 'active' class to the clicked link
    this.classList.add("active");
  });
});

function displayExplanation(explanationId) {
  let exp = document.getElementById(explanationId)
  if(exp.style.display === 'none' || exp.style.display === ''){
    exp.style.display="block"
  }
  else {
    exp.style.display = "none"
  }
}

function displayRow() {
  let rows = document.getElementsByClassName('row')
  let btn = document.getElementById('btn')
  let anyRowDisplayed = false

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].style.display !== 'none') {
      anyRowDisplayed = true;
      break;
    }
  }

  for(let i = 0; i < rows.length; i++){
    if(anyRowDisplayed){
      rows[i].style.display="none"
    }
    else {
      rows[i].style.display="flex"
      rows[i].style.justifyContent="center"
    }
  }

  if(anyRowDisplayed){
    btn.textContent = 'Click to see more...'
  }
  else{
    btn.textContent = 'Click to see less...'
  }
}

function navigateNavBar() {
  location.href="services.html"
}