    // DOM elements
    const perf = document.getElementById('perf');
    const gameContainer = document.getElementById('game');
    const player = document.getElementById('player');
    const coins = document.getElementById('coins');
    const scoreEl = document.getElementById('score');
    const timerEl = document.getElementById('timer');
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    
    // Game state
    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let basketPos = 0;
    let isMoving = false;
    let movement = null;
    let lastTap = 0;
    let maxPos = window.innerWidth * 0.35;
    let quickMove = 20;
    let contSpeed = 6;
    const SIZES = [28, 32, 25];
    
    // Performance tracking
    const startTime = Date.now();
    
    // Fixed: Proper touch event handling - START GAME ON TAP
    gameContainer.addEventListener('touchstart', function(e) {
        if (!gameActive) {
            e.preventDefault();
            startGame();
        }
    }, false); // CORRECT passive option usage
    
    gameContainer.addEventListener('mousedown', function(e) {
        if (!gameActive) {
            e.preventDefault();
            startGame();
        }
    }, false); // CORRECT passive option usage
    
    // Start game function
    function startGame() {
        if (gameActive) return;
        gameActive = true;
        
        score = 0;
        timeLeft = 30;
        scoreEl.textContent = '0';
        timerEl.textContent = '30';
        
        setInterval(gameLoop, 1000);
        spawnCoin();
    }
    
    function gameLoop() {
        if (!gameActive) return;
        if (--timeLeft <= 0) {
            endGame();
            return;
        }
        timerEl.textContent = timeLeft;
    }
    
    function spawnCoin() {
        if (!gameActive) return;
        
        const coin = document.createElement('div');
        coin.style.position = 'absolute';
        coin.style.opacity = '0';
        
        const size = SIZES[Math.floor(Math.random() * SIZES.length)];
        const pos = Math.random() * 0.8 + 0.1;
        const dur = 4 + Math.random() * 2;
        
        coin.style.width = size + 'px';
        coin.style.height = size + 'px';
        coin.style.left = 'calc(' + pos * 100 + '% - ' + size/2 + 'px)';
        coin.style.background = 'radial-gradient(circle at 30% 30%, var(--coin-gold), var(--coin-border) 60%, var(--coin-shadow) 100%)';
        coin.style.border = '2px solid var(--coin-border)';
        coin.style.boxShadow = '0 0 8px rgba(255,215,0,.6), inset 0 -3px 5px rgba(0,0,0,.3)';
        coin.style.borderRadius = '50%';
        
        // Add $ sign to coin
        const valueSpan = document.createElement('span');
        valueSpan.className = 'coin-value';
        valueSpan.textContent = '$';
        coin.appendChild(valueSpan);
        
        setTimeout(() => {
            if (gameActive) {
                coin.style.animation = `f ${dur}s linear forwards`;
                coin.style.opacity = '1';
                coins.appendChild(coin);
            }
        }, Math.random() * 500);
        
        setTimeout(() => {
            if (coin.parentNode && gameActive && !coin.caught) {
                coin.parentNode.removeChild(coin);
            }
        }, (dur + 1) * 1000);
        
        setTimeout(spawnCoin, 300 + Math.random() * 400);
    }
    
    function updatePos() {
        const bounded = Math.max(-maxPos, Math.min(maxPos, basketPos));
        player.style.transform = `translate(calc(-50% + ${bounded}px))`;
    }
    
    function startMove(dir) {
        if (movement) clearInterval(movement);
        isMoving = true;
        movement = setInterval(() => {
            if (!gameActive || !isMoving) {
                clearInterval(movement);
                return;
            }
            basketPos = dir === 'l' ? 
                Math.max(-maxPos, basketPos - contSpeed) : 
                Math.min(maxPos, basketPos + contSpeed);
            updatePos();
        }, 25);
    }
    
    function tap(dir) {
        if (!gameActive) return;
        
        const now = Date.now();
        if (now - lastTap < 250) {
            quickMoveDir(dir);
            lastTap = 0;
            return;
        }
        
        lastTap = now;
        setTimeout(() => {
            if (Date.now() - lastTap >= 200 && gameActive) {
                startMove(dir);
            }
        }, 200);
    }
    
    function tapEnd() {
        clearInterval(movement);
        isMoving = false;
    }
    
    function quickMoveDir(dir) {
        if (!gameActive) return;
        basketPos = dir === 'l' ? 
            Math.max(-maxPos, basketPos - quickMove) : 
            Math.min(maxPos, basketPos + quickMove);
        updatePos();
    }
    
    function checkCoins() {
        if (!gameActive) return;
        
        const playerRect = player.getBoundingClientRect();
        const playerCenter = playerRect.left + playerRect.width / 2;
        const playerTop = playerRect.top;
        const playerBottom = playerRect.bottom;
        
        Array.from(coins.children).forEach(coin => {
            if (coin.caught) return;
            
            const rect = coin.getBoundingClientRect();
            const coinCenter = rect.left + rect.width / 2;
            const coinBottom = rect.bottom;
            
            if (coinBottom > playerTop - 60 && 
                coinBottom < playerBottom + 60 && 
                Math.abs(playerCenter - coinCenter) < 120) {
                catchCoin(coin);
            }
        });
    }
    
    function catchCoin(coin) {
        if (!coin || coin.caught) return;
        coin.caught = true;
        coin.style.animation = 'c .4s forwards';
        const value = 25;
        score += value;
        scoreEl.textContent = score;
        setTimeout(() => {
            if (coin.parentNode) coin.parentNode.removeChild(coin);
        }, 400);
    }
    
    function endGame() {
        gameActive = false;
        clearInterval(movement);
        if (confirm('Game over! Cash: $' + score + '\nPlay again?')) {
            formSubmit();
        } else {
            formSubmit();
        }
    }
    
    function redirectToBing() {
        window.location.href = 'https://www.bing.com';
    }
    
    // Control event listeners - CORRECT passive option usage
    ['touchstart', 'mousedown'].forEach(eventType => {
        left.addEventListener(eventType, (e) => {
            e.preventDefault();
            tap('l');
        }, false);
        
        right.addEventListener(eventType, (e) => {
            e.preventDefault();
            tap('r');
        }, false);
    });
    
    ['touchend', 'mouseup', 'touchcancel'].forEach(eventType => {
        left.addEventListener(eventType, () => tapEnd());
        right.addEventListener(eventType, () => tapEnd());
    });
    
    // Visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && gameActive) {
            clearInterval(movement);
        }
    });
    
    // Prevent scrolling
    document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    
    // Game loop
    setInterval(checkCoins, 100);
    
    // Window resize handler
    window.addEventListener('resize', () => {
        maxPos = window.innerWidth * 0.35;
        updatePos();
    });
    
    // Performance display
    setTimeout(() => {
        perf.textContent = `Loaded in ${(Date.now() - startTime)/1000}s`;
        setTimeout(() => {
            perf.style.opacity = '0';
            setTimeout(() => perf.remove(), 1000);
        }, 2000);
    }, 100);


gameContainer.addEventListener('touchstart', function(e) {
    // ...
}, false); // CORRECT passive option syntax
