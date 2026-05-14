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

  // To send real emails, we are using the Web3Forms API.
  // 1. Visit https://web3forms.com/
  // 2. Enter your Gmail address to get an Access Key via email.
  // 3. Replace "YOUR_ACCESS_KEY_HERE" below with your actual Access Key.
  let formData = {
    access_key: "0bf87798-a45b-4668-9757-2979130d4ce2",
    subject: "New Contact Form Submission from " + name,
    from_name: "Iron Edge Fitness Contact Form",
    name: name,
    email: email,
    phone_number: number,
    message: messageInput
  };

  const originalBtnText = sendEmail.innerText;
  sendEmail.innerText = "Sending...";

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        showPopup("Message sent successfully!");

        // --- CUSTOM AUTORESPONDER (SENDING DISCOUNT CODE) ---
        // Because Web3Forms prevents sending unstructured emails to visitors for spam reasons,
        // we use EmailJS to email the visitor back automatically.
        // 1. Sign up for free at https://www.emailjs.com/
        // 2. Add an Email Service & create an Auto-Reply Email Template.
        // 3. Put your Public Key, Service ID, and Template ID below.
        try {
          emailjs.init("RsVg9wFvnAniYocAM"); // e.g. "user_xxxxxxxxxxx"

          const autoReplyMsg = `Dear Fitness Enthusiast,

Are you ready to push past your limits and transform your body like never before?

Welcome to Iron Edge Gym — where ordinary people become stronger, fitter, faster, and more confident every single day. Whether your goal is muscle gain, fat loss, strength, boxing fitness, or simply building a powerful physique, this is where your transformation begins.

💥 EXCLUSIVE LIMITED-TIME OFFER 💥

Join now and get access to:

✅ Special Discounted Membership Plans
✅ Free Beginner Fitness Guidance
✅ Access to High-Quality Equipment
✅ Motivating & Energetic Gym Environment
✅ Expert Workout Support
✅ A Community That Pushes You to Become Better Every Day

At Iron Edge Gym, we believe fitness is not just about lifting weights — it’s about building discipline, confidence, and a mindset that separates you from the crowd.

⚡ Don’t wait for “someday.”
The best transformations start with one decision — starting NOW.

This special offer won’t last long, and memberships are filling quickly.

📍 Location: Phagwara
📞 Contact: 6282535131

Reply to this email or contact us today to reserve your spot and begin your fitness journey with Iron Edge Gym.

See you at the gym.

Best Regards,
Iron Edge Gym
Phagwara
6282535131`;

          emailjs.send("service_xfbc49f", "template_xutpuwh", {
            to_email: email,
            to_name: name,
            custom_message: autoReplyMsg
          });
          console.log("Auto-responder discount email triggered to " + email);
        } catch (e) {
          console.error("EmailJS auto-reply error: ", e);
        }
        // ----------------------------------------------------

        // Reset form fields
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('number').value = '';
        document.getElementById('message').value = '';
      } else {
        showPopup(json.message || "Something went wrong!", true);
      }
    })
    .catch(error => {
      console.error(error);
      showPopup("Oops! Something went wrong while sending the email.", true);
    })
    .finally(() => {
      sendEmail.innerText = originalBtnText;
    });
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