// API URLs
const bitcoinPriceAPI = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
const newsAPI = 'https://newsdata.io/api/1/news?apikey=pub_52415bed509523278d9aed59040ed2a09a0a2&q=bitcoin'; // Updated news API URL
const historicalDataAPI = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365';

// Elements
const priceDisplay = document.getElementById('price-display');
const newsFeed = document.getElementById('news-feed');
const loadMoreBtn = document.getElementById('load-more');
const quizContainer = document.getElementById('quiz-container');

// Fetch Real-Time Bitcoin Price
async function fetchBitcoinPrice() {
  try {
    const response = await fetch(bitcoinPriceAPI);
    if (!response.ok) throw new Error(`Error fetching price: ${response.statusText}`);
    const data = await response.json();
    priceDisplay.textContent = `$${data.bitcoin.usd.toLocaleString()}`;
  } catch (error) {
    console.error(error);
    priceDisplay.textContent = 'Loading...';
  }
}

// Fetch Recent News
let currentPage = 1;

async function fetchNews() {
  try {
    const response = await fetch(`${newsAPI}&page=${currentPage}`);
    if (!response.ok) throw new Error(`Error fetching news: ${response.statusText}`);
    const data = await response.json();
    
    if (data && data.results) {
      data.results.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
          <h3>${article.title}</h3>
          <p>${article.description || ''}</p>
          <a href="${article.link}" target="_blank">Read more</a>
        `;
        newsFeed.appendChild(newsItem);
      });
    } else {
      newsFeed.textContent = 'No news available';
    }
  } catch (error) {
    console.error(error);
    newsFeed.textContent = '• SEC Warns it May Challenge FTX’s Stablecoin-Denominated Repayments Plan.';
  }
}

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  fetchNews();
});

// Fetch Historical Data and Render Chart
async function fetchHistoricalData() {
  try {
    const response = await fetch(historicalDataAPI);
    if (!response.ok) throw new Error(`Error fetching historical data: ${response.statusText}`);
    const data = await response.json();
    renderChart(data.prices);
  } catch (error) {
    console.error('Error fetching historical data', error);
  }
}

function renderChart(prices) {
  const ctx = document.getElementById('bitcoinChart').getContext('2d');
  const chartData = {
    labels: prices.map(price => new Date(price[0]).toLocaleDateString()),
    datasets: [{
      label: 'Bitcoin Price (USD)',
      data: prices.map(price => price[1]),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }]
  };

  new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price (USD)'
          }
        }
      }
    }
  });
}

// Quiz Data
const quizData = [
  {
    question: "What is Bitcoin's maximum supply?",
    options: ["21 million", "100 million", "Infinite"],
    answer: "21 million"
  },
  {
    question: "Who created Bitcoin?",
    options: ["Elon Musk", "Satoshi Nakamoto", "Bill Gates"],
    answer: "Satoshi Nakamoto"
  },
  {
    question: "In what year was the Bitcoin whitepaper published?",
    options: ["2005", "2008", "2010"],
    answer: "2008"
  },
  {
    question: "What is the primary technology that Bitcoin is built on?",
    options: ["Artificial Intelligence", "Quantum Computing", "Blockchain"],
    answer: "Blockchain"
  },
  {
    question: "What is the smallest unit of Bitcoin called?",
    options: ["Bitcoin", "Satoshi", "Bit"],
    answer: "Satoshi"
  },
  {
    question: "Which of the following is NOT a feature of Bitcoin?",
    options: ["Decentralization", "Fixed supply", "Physical existence"],
    answer: "Physical existence"
  },
  {
    question: "What is Bitcoin mining?",
    options: ["Creating new bitcoins", "Solving complex mathematical problems", "Both A and B"],
    answer: "Both A and B"
  },
  {
    question: "What is the primary purpose of Bitcoin?",
    options: ["To serve as a digital currency", "To replace all fiat currencies", "To create inflation"],
    answer: "To serve as a digital currency"
  },
  {
    question: "What does 'HODL' stand for in the Bitcoin community?",
    options: ["Hold On for Dear Life", "Hold On to Digital Life", "High Order Digital Ledger"],
    answer: "Hold On for Dear Life"
  },
  {
    question: "Which event is known to reduce Bitcoin mining rewards by half?",
    options: ["Forking", "Halving", "Splitting"],
    answer: "Halving"
  },
  {
    question: "How often does a new block get added to the Bitcoin blockchain?",
    options: ["Every 1 minute", "Every 10 minutes", "Every hour"],
    answer: "Every 10 minutes"
  },
  {
    question: "What does it mean when Bitcoin is described as a 'deflationary' asset?",
    options: ["Its supply is decreasing", "It has a fixed supply", "It loses value over time"],
    answer: "It has a fixed supply"
  },
  {
    question: "Which programming language is primarily used to develop Bitcoin Core?",
    options: ["Java", "Python", "C++"],
    answer: "C++"
  },
  {
    question: "What is the reward for solving a block in Bitcoin mining as of 2024?",
    options: ["6.25 BTC", "12.5 BTC", "3.125 BTC"],
    answer: "6.25 BTC"
  },
  {
    question: "What does 'double spending' mean in the context of Bitcoin?",
    options: ["Spending more than you have", "Spending the same Bitcoin twice", "Exceeding the transaction limit"],
    answer: "Spending the same Bitcoin twice"
  }
];


let currentQuizIndex = 0;
let score = 0;

function renderQuiz() {
  if (currentQuizIndex < quizData.length) {
    const currentQuiz = quizData[currentQuizIndex];
    quizContainer.innerHTML = `
      <p>${currentQuiz.question}</p>
      ${currentQuiz.options.map(option => `
        <div>
          <input type="radio" name="quiz" value="${option}" id="${option}">
          <label for="${option}">${option}</label>
        </div>
      `).join('')}
      <button class="btn" onclick="submitQuiz()">Submit</button>
    `;
  } else {
    quizContainer.innerHTML = `<p>Your Score: ${score}/${quizData.length}</p>`;
  }
}

function submitQuiz() {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    if (selectedOption.value === quizData[currentQuizIndex].answer) {
      score++;
    }
    currentQuizIndex++;
    renderQuiz();
  }
}

// Initialize Portal
function initializePortal() {
  fetchBitcoinPrice();
  fetchNews();
  fetchHistoricalData();
  renderQuiz();
}

document.addEventListener('DOMContentLoaded', initializePortal);
