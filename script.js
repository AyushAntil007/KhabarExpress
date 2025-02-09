const container = document.querySelector(".container");
const optionsContainer = document.querySelector(".options-container");
const options = [
  "general",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

// Your NewsAPI Key
const API_KEY = 'd87ec6552386412aa82ac5ebcfe10294'; // Replace with your API key

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

  requestURL = `https://newsapi.org/v2/everything?q=india%20${category}&language=en&apiKey=${API_KEY}`;
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
