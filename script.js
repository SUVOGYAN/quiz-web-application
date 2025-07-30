// Quiz questions data
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin"],
        correctAnswer: 3
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correctAnswer: 0
    },
    {
        question: "Which country is home to the Great Barrier Reef?",
        options: ["Brazil", "Australia", "Indonesia", "Thailand"],
        correctAnswer: 1
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo", "Leonardo da Vinci"],
        correctAnswer: 3
    },
    {
        question: "Which element is most abundant in Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: 2
    },
    {
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        correctAnswer: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1
    },
    {
        question: "What is the speed of light in kilometers per second (approximate)?",
        options: ["200,000", "250,000", "300,000", "350,000"],
        correctAnswer: 2
    },
    {
        question: "Which continent is the largest by land area?",
        options: ["North America", "Africa", "Asia", "Antarctica"],
        correctAnswer: 2
    },
    {
        question: "What is the main component of the Sun?",
        options: ["Helium", "Hydrogen", "Nitrogen", "Oxygen"],
        correctAnswer: 1
    },
    {
        question: "Which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correctAnswer: 2
    }
];

// Quiz state
let currentQuestion = 0;
let userAnswers = new Array(15).fill(null);
let visitedQuestions = new Set();
let timeLeft = 30 * 60; // 30 minutes in seconds
let timerInterval;
let userEmail = '';

// DOM Elements
const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const reportPage = document.getElementById('report-page');
const emailForm = document.getElementById('email-form');
const timeDisplay = document.getElementById('time');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionOverview = document.getElementById('question-overview');
const submitQuizBtn = document.getElementById('submit-quiz');
const reportContainer = document.getElementById('report-container');
const questionSlider = document.getElementById('question-slider');
const prevQuestionBtn = document.getElementById('prev-question');
const nextQuestionBtn = document.getElementById('next-question');
const sliderValue = document.getElementById('slider-value');

// Event Listeners
emailForm.addEventListener('submit', startQuiz);
submitQuizBtn.addEventListener('click', submitQuiz);
questionSlider.addEventListener('input', handleSliderChange);
prevQuestionBtn.addEventListener('click', navigateToPrevQuestion);
nextQuestionBtn.addEventListener('click', navigateToNextQuestion);

// Initialize the quiz
function startQuiz(e) {
    e.preventDefault();
    userEmail = document.getElementById('email').value;
    startPage.classList.add('hidden');
    quizPage.classList.remove('hidden');
    initializeQuiz();
}

function initializeQuiz() {
    // Create question navigation
    for (let i = 0; i < 15; i++) {
        const questionBtn = document.createElement('div');
        questionBtn.className = 'question-number';
        questionBtn.textContent = i + 1;
        questionBtn.addEventListener('click', () => navigateToQuestion(i));
        questionOverview.appendChild(questionBtn);
    }

    // Start timer
    startTimer();

    // Load first question
    loadQuestion(0);
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function loadQuestion(index) {
    currentQuestion = index;
    const question = quizQuestions[index];
    visitedQuestions.add(index);

    // Update question text
    questionText.textContent = `Question ${index + 1}: ${question.question}`;

    // Clear and update options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = `option ${userAnswers[index] === i ? 'selected' : ''}`;
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectOption(i));
        optionsContainer.appendChild(optionDiv);
    });

    // Update navigation panel
    updateNavigationPanel();
    
    // Update slider position
    questionSlider.value = index;
    updateSliderValue(index);
}

function selectOption(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;
    updateNavigationPanel();
    loadQuestion(currentQuestion); // Reload question to update UI
}

function navigateToQuestion(index) {
    loadQuestion(index);
}

function handleSliderChange() {
    const questionIndex = parseInt(questionSlider.value);
    loadQuestion(questionIndex);
    updateSliderValue(questionIndex);
}

function updateSliderValue(index) {
    sliderValue.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
}

function navigateToPrevQuestion() {
    if (currentQuestion > 0) {
        loadQuestion(currentQuestion - 1);
    }
}

function navigateToNextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        loadQuestion(currentQuestion + 1);
    }
}


function updateNavigationPanel() {
    const questionButtons = questionOverview.children;
    for (let i = 0; i < questionButtons.length; i++) {
        questionButtons[i].className = 'question-number';
        if (visitedQuestions.has(i)) questionButtons[i].classList.add('visited');
        if (userAnswers[i] !== null) questionButtons[i].classList.add('attempted');
    }
}

function submitQuiz() {
    clearInterval(timerInterval);
    quizPage.classList.add('hidden');
    reportPage.classList.remove('hidden');
    generateReport();
}

function generateReport() {
    reportContainer.innerHTML = '';
    let score = 0;

    quizQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) score++;

        const reportItem = document.createElement('div');
        reportItem.className = 'report-item';
        reportItem.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.question}</p>
            <div class="answer-comparison">
                <div class="user-answer ${isCorrect ? '' : 'incorrect'}">
                    <h4>Your Answer:</h4>
                    <p>${userAnswer !== null ? question.options[userAnswer] : 'Not answered'}</p>
                </div>
                <div class="correct-answer">
                    <h4>Correct Answer:</h4>
                    <p>${question.options[question.correctAnswer]}</p>
                </div>
            </div>
        `;
        reportContainer.appendChild(reportItem);
    });

    // Add score summary
    const scoreSummary = document.createElement('div');
    scoreSummary.className = 'report-item';
    scoreSummary.innerHTML = `
        <h3>Quiz Summary</h3>
        <p>Email: ${userEmail}</p>
        <p>Score: ${score} out of ${quizQuestions.length}</p>
        <p>Time Taken: ${formatTime(30 * 60 - timeLeft)}</p>
    `;
    reportContainer.insertBefore(scoreSummary, reportContainer.firstChild);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}