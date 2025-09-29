const container = document.querySelector(".container");
const optionsContainer = document.querySelector(".options-container");

// Add the "disaster" category
const options = [
  "general",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
  "disaster"
];

// Your NewsAPI Key
const API_KEY = 'd87ec6552386412aa82ac5ebcfe10294'; // Use direct assignment, not process.env

let requestURL;

// Create cards from data
const generateUI = (articles) => {
  console.log('Generating UI with articles:', articles);
  if (!articles || articles.length === 0) {
    console.log('No articles found');
    container.innerHTML = "<p>No articles available at the moment.</p>";
    return;
  }

  for (let item of articles) {
    console.log('Article Data:', item);

    let card = document.createElement("div");
    card.classList.add("news-card");

    let imageUrl = item.urlToImage || "https://via.placeholder.com/150";

    card.innerHTML = `
      <div class="news-image-container">
        <img src="${imageUrl}" alt="News Image" />
      </div>
      <div class="news-content">
        <div class="news-title">
          ${item.title || "No Title Available"}
        </div>
        <div class="news-description">
          ${item.description || ""}
        </div>
        <a href="${item.url || '#'}" target="_blank" class="view-button">Read More</a>
      </div>`;

    // Add ripple effect on mousemove
    card.addEventListener('mousemove', (e) => {
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      const cardRect = card.getBoundingClientRect();
      const rippleX = e.clientX - cardRect.left;
      const rippleY = e.clientY - cardRect.top;
      ripple.style.left = `${rippleX - 30}px`;
      ripple.style.top = `${rippleY - 30}px`;
      card.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });

    container.appendChild(card);
  }

  // Remove previous donation button if any
  const oldDonationBtn = document.querySelector('.donation-btn-container');
  if (oldDonationBtn) oldDonationBtn.remove();

  // If disaster category, add donation button
  if (requestURL.includes('disaster')) {
    const donationDiv = document.createElement('div');
    donationDiv.className = 'donation-btn-container';
    donationDiv.innerHTML = `
      <input type="number" min="1" placeholder="Enter amount (INR)" class="donation-amount-input" style="margin-right:10px; padding:8px; border-radius:20px; border:1px solid #ddd; width:140px;">
      <button class="donation-btn" id="razorpay-donate-btn">
        💖 Donate for Disaster Relief
      </button>
    `;
    container.parentNode.insertBefore(donationDiv, container);

    document.getElementById('razorpay-donate-btn').onclick = function() {
      const amountInput = document.querySelector('.donation-amount-input');
      let amount = parseInt(amountInput.value, 10);
      if (isNaN(amount) || amount < 1) {
        alert("Please enter a valid amount (minimum ₹1).");
        return;
      }
      const options = {
        key: "rzp_test_RMzsXbFFqrbmtY", // Replace with your Razorpay key
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Disaster Relief Donation",
        description: "Support disaster relief efforts",
        image: "https://yourdomain.com/logo.png", // Optional logo
        handler: function (response){
          alert("Thank you for your donation! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "",
          email: ""
        },
        theme: {
          color: "#dd2476"
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    // Load Razorpay script if not already loaded
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }
};

// News API Call
const getNews = async () => {
  container.innerHTML = "";
  try {
    let response = await fetch(requestURL);
    if (!response.ok) {
      alert("Data unavailable at the moment. Please try again later");
      return false;
    }
    let data = await response.json();
    generateUI(data.articles);
  } catch (error) {
    alert("An error occurred while fetching the news. Please try again later.");
  }
};

// Category Selection
const selectCategory = (e, category) => {
  let options = document.querySelectorAll(".option");
  options.forEach((element) => {
    element.classList.remove("active");
  });

  // Handle disaster category separately if needed
  if(category === "disaster"){
    requestURL = `https://newsapi.org/v2/everything?q=disaster%20india&language=en&apiKey=${API_KEY}`;
  } else {
    requestURL = `https://newsapi.org/v2/everything?q=india%20${category}&language=en&apiKey=${API_KEY}`;
  }

  e.target.classList.add("active");
  getNews();
};

// Options Buttons
const createOptions = () => {
  for (let i of options) {
    optionsContainer.innerHTML += `<button class="option ${i == "general" ? "active" : ""}" onclick="selectCategory(event,'${i}')">${i}</button>`;
  }
};

const init = () => {
  optionsContainer.innerHTML = "";
  getNews();
  createOptions();
};

window.onload = () => {
  requestURL = `https://newsapi.org/v2/everything?q=india&language=en&apiKey=${API_KEY}`;
  init();
};

// Toggle Night Mode
const toggleNightMode = () => {
  document.body.classList.toggle("night-mode");
};

// Add event listener to the night mode button
document.querySelector(".night-mode-btn").addEventListener("click", toggleNightMode);

document.addEventListener('DOMContentLoaded', () => {
  const nightModeBtn = document.querySelector('.night-mode-btn');
  nightModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    document.querySelector('.heading-container').classList.toggle('night-mode');
    document.querySelectorAll('.option').forEach(option => {
      option.classList.toggle('night-mode');
    });
    document.querySelectorAll('.news-card').forEach(card => {
      card.classList.toggle('night-mode');
    });
    document.querySelector('.footer').classList.toggle('night-mode');
  });
});
