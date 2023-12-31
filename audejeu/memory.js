export default class aude extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shuffledSymbols = []; // Declare shuffledSymbols as a property
        this.timerInterval;
        this.seconds = 0;
        this.minutes = 0;
        this.bestTime;
        this.selectedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.counterElement = null;
    }
    setHTML() {
        const memoryContent = `
            <style>
                  :host {
                    display: block;
                    text-align: center;
                    font-family: 'Arial', sans-serif;
                    background-image:url("./audejeu/memory.jpg");
                background-repeat: no-repeat;
                height: 100%;
                }

                h1 {
                    color: #0066cc;
                }

                #memory-container {
                    display: grid;
                    grid-template-columns: repeat(5, 100px);
                    grid-gap: 10px;
                    margin-top: 20px;
                }

                .card {
                    width: 100px;
                    height: 100px;
                    background-color: #fff;
                    display: grid;
                    place-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .flipped {
                    background-color: #ddd;
                }

                #level-buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    margin-bottom: 20px;
                }

                #counter {
                    margin-top: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    color:white;

                }
                p{
                    color: white;
                }
                 @media only screen and (max-width: 600px) {
                    #memory-container {
                        grid-template-columns: repeat(2, 1fr);
                    }
                     @media only screen and (min-width: 601px) and (max-width: 900px) {
                    #memory-container {
                        grid-template-columns: repeat(3, 1fr);
                    }  
                    @media only screen and (min-width: 901px) and (max-width: 1200px) {
                    #memory-container {
                        grid-template-columns: repeat(4, 1fr);
                    }
            </style>
            <h1>Jeu de Memory </h1>

            <div id="timer" style="display: none;">0:00</div>
        <div id="memory-container"></div>

            <div id="level-buttons">
                <button data-cardcount="10">Niveau Facile</button>
                <button data-cardcount="14">Niveau Moyen</button>
                <button data-cardcount="16">Niveau Difficile</button>
               <button data-cardcount="20">Niveau extreme</button>
            </div>
<p> choisissez un niveaux <p>
            <div id="counter">Coups: 0</div>
        `;

        this.shadowRoot.innerHTML = memoryContent;

        // Add event listeners
        this.shadowRoot.getElementById("level-buttons").addEventListener("click", (event) => this.handleLevelButtonClick(event));
    }
 flipCardOnTouch(cardElement) {
        // Add touchstart event for mobile devices
        cardElement.addEventListener('touchstart', () => {
            cardElement.classList.add('flipped');
            cardElement.innerHTML = this.shuffledSymbols[cardElement.dataset.index];
            this.selectedCards.push(cardElement);

            if (this.selectedCards.length === 2) {
                this.moves++;
                this.counterElement.textContent = `Coups: ${this.moves}`;
                setTimeout(() => this.checkForMatch(), 500);
            }
        });
    }
    startGame(cardCount) {
        const symbols = ['🎄', '🎅', '🎁', '⛄', '🔔', '❄️', '🦌', '🕯️', '🌟', '🤶'];
        const gameContainer = this.shadowRoot.getElementById('memory-container');
        this.counterElement = this.shadowRoot.getElementById('counter'); // Set counterElement here
        this.selectedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        switch (cardCount) {
            case 10:
                gameContainer.style.gridTemplateColumns = "";
                break;
            case 14:
                gameContainer.style.gridTemplateColumns = "repeat(7, 100px)";
                break;
            case 16:
                gameContainer.style.gridTemplateColumns = "repeat(8, 100px)";
                break;
            case 20:
                gameContainer.style.gridTemplateColumns = "";
                break;
        }
        // Duplicate the symbols to make pairs
        const symbolPairs = symbols.slice(0, cardCount / 2).concat(symbols.slice(0, cardCount / 2));

        // Shuffle the symbols and assign to the class property
        this.shuffledSymbols = this.shuffleArray(symbolPairs);

        // Clear previous game
        gameContainer.innerHTML = '';
        this.counterElement.textContent = 'Coups: 0'; // Use this.counterElement here

        // Create and append cards to the game container
        this.shuffledSymbols.forEach((symbol, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;

            // Set the symbol on the card
            cardElement.innerHTML = '🌟'; // Cards are initially face down
            cardElement.addEventListener('click', () => this.flipCard(cardElement));
            gameContainer.appendChild(cardElement);
        });
    }

    flipCard(cardElement) {
        cardElement.classList.add('flipped');
        cardElement.innerHTML = this.shuffledSymbols[cardElement.dataset.index];
        this.selectedCards.push(cardElement);

        if (this.selectedCards.length === 2) {
            this.moves++;
            this.counterElement.textContent = `Coups: ${this.moves}`;
            setTimeout(() => this.checkForMatch(), 500);
        }
    }

    checkForMatch() {
        const [card1, card2] = this.selectedCards;

        if (card1.innerHTML === card2.innerHTML) {
            card1.removeEventListener('click', () => this.flipCard(card1));
            card2.removeEventListener('click', () => this.flipCard(card2));
            this.matchedCards.push(card1, card2);

            if (this.matchedCards.length === this.shuffledSymbols.length) {
                alert(`Félicitations ! Vous avez trouvé toutes les paires en ${this.moves} coups.`);
            }
        } else {
            // Flip the cards face down again
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.innerHTML = '🌟';
            card2.innerHTML = '🌟';
        }

        this.selectedCards = [];
    }


    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    handleLevelButtonClick(event) {
        if (event.target.tagName === 'BUTTON') {
            const cardCount = parseInt(event.target.dataset.cardcount);
            this.startGame(cardCount);
        }
    }
    startTimer() {
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    updateTimer() {
        this.seconds++;
        if (this.seconds === 60) {
            this.seconds = 0;
            this.minutes++;
        }
        this.updateTimerDisplay();
    }

    resetTimer() {
        this.stopTimer();
        this.seconds = 0;
        this.minutes = 0;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const timerElement = this.shadowRoot.getElementById("timer");
        timerElement.textContent = `${this.minutes}:${this.seconds < 10 ? "0" : ""}${this.seconds}`;
    }

    startMusic() {
        this.backgroundMusic.play();
    }

    handleLevelButtonClick(event) {
        if (event.target.tagName === 'BUTTON') {
            const cardCount = parseInt(event.target.dataset.cardcount);
            this.startGame(cardCount);
        }
    }


    connectedCallback() {
        this.setHTML();
    }

    disconnectedCallback() {
        this.shadowRoot.innerHTML = "";
    }
}

customElements.define("balise-animation7", aude)
