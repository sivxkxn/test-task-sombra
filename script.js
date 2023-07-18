class MatchGrid {
  constructor(args) {
    this.rows = args.rows;
    this.cols = args.cols;
    this.width = args.width;
    this.height = args.height;
    this.timeLimit = args.timeLimit;
    this.theme = args.theme;
    this.cards = [];
    this.selectedCards = [];
    this.matchedCards = [];
    this.isGameStarted = false;
    this.timer = null;
    this.timeRemaining = this.timeLimit;

    console.log(this.theme);
    this.grid = document.createElement('div');

    this.grid.classList.add('grid');

    this.initializeGrid();
    this.setTheme();
  }

  setTheme() {
    const { backgroundColor, cardColor, fontColor } = this.theme;

    document.body.style.backgroundColor = backgroundColor;
    this.cards.forEach(card => {
      card.style.backgroundColor = cardColor;
      card.style.color = fontColor;
    });
  };

  initializeGrid() {
    const grid = document.getElementById('grid');
    grid.style.width = `${this.width}px`;
    grid.style.height = `${this.height}px`;

    const totalCards = this.rows * this.cols;
    const cardValues = Array.from({ length: totalCards / 2 }, (_, i) => i + 1);
    const cardPairs = cardValues.concat(cardValues);

    cardPairs.forEach((value) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.value = value;
      card.addEventListener('click', () => this.flipCard(card));
      card.innerHTML = `
        <div class="front"></div>
        <div class="back">${value}</div>
      `;
      grid.appendChild(card);
      this.cards.push(card);
    });
    this.shuffleCards();

  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  flipCard(card) {
    if (!this.isGameStarted || card.classList.contains('flip') || this.selectedCards.length >= 2) {
      return;
    }

    card.classList.add('clickable');
    card.style.transform = 'rotateY(180deg)';

    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      const [card1, card2] = this.selectedCards;

      if (card1.dataset.value === card2.dataset.value) {
        this.matchedCards.push(card1, card2);
        this.selectedCards = [];

        if (this.matchedCards.length === this.cards.length) {
          this.endGame();
        }
      } else {
        setTimeout(() => {
          anime({
            targets: this.selectedCards,
            rotateY: '0deg',
            easing: 'easeInOutQuad',
            duration: 500,
            complete: () => {
              this.selectedCards.forEach((card) => {
                card.style.transform = 'rotateY(0deg)';
                card.classList.remove('clickable');
              });
              this.selectedCards = [];
            }
          });
        }, 1000);
      }
    }
  }

  startGame() {
    this.isGameStarted = true;
    this.cards.forEach((card) => {
      card.style.transform = 'rotateY(0deg)';
      card.classList.add('clickable');
    });
    document.getElementById('startButton').disabled = true;
    document.getElementById('endButton').disabled = false;
    document.getElementById('replayButton').disabled = true;

    this.startTimer();
  }

  endGame() {
    this.isGameStarted = false;
    this.cards.forEach((card) => {
      card.style.transform = 'rotateY(0deg)';
      card.classList.remove('clickable');
    });
    this.selectedCards = [];
    this.matchedCards = [];
    document.getElementById('startButton').disabled = false;
    document.getElementById('endButton').disabled = true;
    document.getElementById('replayButton').disabled = false;

    this.stopTimer();
  }

  replayGame() {
    this.timeRemaining = this.timeLimit;
    this.isGameStarted = false;
    this.cards.forEach((card) => {
      card.style.transform = 'rotateY(0deg)';
      card.classList.remove('clickable');
    });
    this.selectedCards = [];
    this.matchedCards = [];
    document.getElementById('startButton').disabled = false;
    document.getElementById('endButton').disabled = true;
    document.getElementById('replayButton').disabled = true;
    document.getElementById('timer').textContent = '0';

    this.shuffleCards();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining >= 0) {
        document.getElementById('timer').textContent = this.timeRemaining;
      } else {
        this.endGame();
      }
    }, 1000);
    document.addEventListener('mouseleave', () => {
      clearInterval(this.timer);
    });
    document.addEventListener('mouseenter', () => {
      if (this.isGameStarted) {
        this.startTimer();
      }
    });
  }

  stopTimer() {
    clearInterval(this.timer);
  }
}

const args = {
  rows: 4,
  cols: 4,
  width: 520,
  height: 520,
  timeLimit: 60,
  theme: {
    backgroundColor: 'aliceblue',
    cardColor: 'cadetblue',
    fontColor: 'white',
  }
};

const matchGrid = new MatchGrid(args);
