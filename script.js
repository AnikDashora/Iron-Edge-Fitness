'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () { navbar.classList.toggle("active"); }

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () { navbar.classList.remove("active"); }

addEventOnElem(navLinks, "click", closeNavbar);



/**
 * header & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

let sendEmail = document.getElementById("sendemail");
sendEmail.addEventListener('click', function (e) {
  e.preventDefault();

  let name = document.getElementById('name').value.trim();
  let email = document.getElementById('email').value.trim();
  let number = document.getElementById('number').value.trim();
  let messageInput = document.getElementById('message').value.trim();

  // Form Validation
  if (!name || !email || !number || !messageInput) {
    showPopup("Please fill in all fields before sending.", true);
    return;
  }

  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    showPopup("Please enter a valid email address.", true);
    return;
  }

  let body = 'name: ' + name + '<br/> email: ' + email + '<br/> number: ' + number + '<br/> message: ' + messageInput;

  showPopup("Message sent successfully!");
});

function showPopup(msg, isError = false) {
  const popup = document.createElement('div');
  const bgColor = isError ? '#ff4b4b' : '#32CD32'; // Red for error, Green for success

  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#111827',
    color: '#fff',
    padding: '30px 40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    zIndex: '10000',
    textAlign: 'center',
    border: `2px solid ${bgColor}`,
    minWidth: '320px',
    fontFamily: "'Rubik', sans-serif"
  });

  popup.innerHTML = `
    <h3 style="margin-bottom: 15px; font-size: 24px; color: ${bgColor}; font-family: 'Catamaran', sans-serif; font-weight: 800;">
      ${isError ? 'Oops!' : 'Success!'}
    </h3>
    <p style="margin-bottom: 25px; font-size: 16px;">${msg}</p>
    <button id="closePopupBtn" style="padding: 10px 25px; background: ${bgColor}; color: #fff; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; font-weight: bold; transition: 0.3s ease; text-transform: uppercase;">Close</button>
  `;

  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: '9999',
    backdropFilter: 'blur(3px)'
  });

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  const closeBtn = document.getElementById('closePopupBtn');
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.transform = 'translateY(-2px)'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.transform = 'translateY(0)'; });

  closeBtn.addEventListener('click', () => {
    popup.remove();
    overlay.remove();
  });
}