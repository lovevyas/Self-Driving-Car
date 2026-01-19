function startGame(mode) {
    const intro = document.getElementById("introScreen");
    const sideBar = document.getElementById("sideBar");

    // 1. Hide Intro
    if(intro){
        intro.style.opacity = "0"; 
        setTimeout(() => {
            intro.style.display = "none";
            // 2. Show Sidebar (After intro fades out)
            if(sideBar) sideBar.style.display = "block";
        }, 500);
    }
    
    // 3. Set flag and Start Game
    gameStarted = true;
    if (typeof init === "function") {
        init(mode);
    }
}

function switchMode(mode) {
    // This is for clicking buttons inside the game
    // It simply re-initializes the game with the new mode
    init(mode);
}

function exitGame() {
    const intro = document.getElementById("introScreen");
    const sideBar = document.getElementById("sideBar");

    // 1. Hide Sidebar
    if(sideBar) sideBar.style.display = "none";

    // 2. Show Intro
    if(intro){
        intro.style.display = "flex"; // Or 'block', depending on your CSS
        // Small timeout to allow display:flex to apply before changing opacity
        setTimeout(() => {
            intro.style.opacity = "1";
        }, 10);
    }

    // 3. Reset to Background Mode (Ghost Mode)
    gameStarted = false;
    init("BACKGROUND");
}

function restartGame() {
    // Just re-run the init function with the stored mode
    if (typeof init === "function" && typeof currentMode !== "undefined") {
        init(currentMode);
    }
}