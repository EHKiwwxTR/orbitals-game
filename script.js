const orbitals = [  
    { name: '1s', shape: '🟡' },  
    { name: '2s', shape: '🔴' },  
    { name: '2p', shape: '🟢' },  
    { name: '3s', shape: '🟤' },  
    { name: '4s', shape: '🟠' },  
    { name: '4p', shape: '🔵' },  
    { name: '5s', shape: '🟣' }  
];  

let score = 0;  
let selectedCards = [];  
let timer;  
let timeLeft;  
let difficulty = 'easy';  
let highScore = localStorage.getItem('highScore') || 0;  

function startGame() {  
    score = 0;  
    timeLeft = setTimeLimit();  
    document.getElementById('score').innerText = score;  
    document.getElementById('time').innerText = timeLeft;  
    document.getElementById('high-score').innerText = highScore;  
    document.getElementById('start-screen').style.display = 'none';  
    document.getElementById('game-screen').style.display = 'block';  
    document.getElementById('end-screen').style.display = 'none';  
    document.getElementById('background-music').play();  

    const gameArea = document.getElementById('game-area');  
    gameArea.innerHTML = '';  
    shuffleArray(orbitals);  
    orbitals.forEach(orbital => {  
        const cardName = createCard(orbital.name);  
        const cardShape = createCard(orbital.shape);  
        gameArea.appendChild(cardName);  
        gameArea.appendChild(cardShape);  
    });  

    startTimer();  
}  

function setTimeLimit() {  
    switch (document.getElementById('difficulty-select').value) {  
        case 'easy': return 60;  
        case 'medium': return 45;  
        case 'hard': return 30;  
    }  
}  

function createCard(content) {  
    const div = document.createElement('div');  
    div.classList.add('card');  
    div.innerText = content;  
    div.onclick = () => selectCard(div, content);  
    return div;  
}  

function selectCard(card, content) {  
    if (selectedCards.length < 2 && !card.classList.contains('paired')) {  
        card.classList.add('paired');  
        selectedCards.push({ card, content });  

        if (selectedCards.length === 2) {  
            checkMatch();  
        }  
    }  
}  

function checkMatch() {  
    const [first, second] = selectedCards;  
    const isMatch = (  
        first.content === second.content ||  
        (orbitals.find(o => o.name === first.content)?.shape === second.content) ||  
        (orbitals.find(o => o.name === second.content)?.shape === first.content)  
    );  

    if (isMatch) {  
        first.card.classList.add('correct');  
        second.card.classList.add('correct');  
        score++;  
        document.getElementById('score').innerText = score;  
        document.getElementById('correct-sound').play();  
    } else {  
        first.card.classList.add('incorrect');  
        second.card.classList.add('incorrect');  
        document.getElementById('incorrect-sound').play();  
        
        setTimeout(() => {  
            first.card.classList.remove('paired');  
            second.card.classList.remove('paired');  
        }, 1000);  
    }  

    selectedCards = [];  
    if (score === orbitals.length) {  
        endGame();  
    }  
}  

function startTimer() {  
    timer = setInterval(() => {  
        timeLeft--;  
        document.getElementById('time').innerText = timeLeft;  
        if (timeLeft <= 0) {  
            endGame();  
        }  
    }, 1000);  
}  

function endGame() {  
    clearInterval(timer);  
    document.getElementById('final-score').innerText = score;  
    if (score > highScore) {  
        highScore = score;  
        localStorage.setItem('highScore', highScore);  
    }  
    document.getElementById('high-score').innerText = highScore;  
    document.getElementById('game-screen').style.display = 'none';  
    document.getElementById('end-screen').style.display = 'block';  
    document.getElementById('background-music').pause();  
}  

function resetGame() {  
    clearInterval(timer);  
    document.getElementById('start-screen').style.display = 'block';  
    document.getElementById('game-screen').style.display = 'none';  
    document.getElementById('end-screen').style.display = 'none';  
}  

function shuffleArray(array) {  
    for (let i = array.length - 1; i > 0; i--) {  
        const j = Math.floor(Math.random() * (i + 1));  
        [array[i], array[j]] = [array[j], array[i]];  
    }  
}