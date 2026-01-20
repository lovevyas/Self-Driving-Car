class Controls{
    constructor(type){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;

        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                this.#addJoystickListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }
    #addJoystickListeners() {
            const base = document.getElementById("joystickBase");
            const knob = document.getElementById("joystickKnob");
            
            if (!base || !knob) return;

            let startX = 0, startY = 0;
            let moveX = 0, moveY = 0;
            const maxDist = 35; // How far the knob can move

            // Touch Start
            base.addEventListener("touchstart", (e) => {
                e.preventDefault();
                const touch = e.changedTouches[0];
                startX = touch.clientX;
                startY = touch.clientY;
            }, { passive: false });

            // Touch Move
            base.addEventListener("touchmove", (e) => {
                e.preventDefault();
                const touch = e.changedTouches[0];
                
                // Calculate distance moved
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                
                // Calculate distance from center (Pythagoras)
                const distance = Math.min(Math.hypot(deltaX, deltaY), maxDist);
                const angle = Math.atan2(deltaY, deltaX);

                // Move the knob visually
                moveX = Math.cos(angle) * distance;
                moveY = Math.sin(angle) * distance;
                knob.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;

                // --- CONVERT ANGLE TO CAR CONTROLS ---
                this.forward = moveY < -10; // Dragged Up
                this.reverse = moveY > 10;  // Dragged Down
                this.left = moveX < -10;    // Dragged Left
                this.right = moveX > 10;    // Dragged Right

            }, { passive: false });

            // Touch End (Reset)
            const resetJoystick = (e) => {
                e.preventDefault();
                moveX = 0;
                moveY = 0;
                knob.style.transform = `translate(-50%, -50%)`; // Reset to center
                
                // Stop Car
                this.forward = false;
                this.reverse = false;
                this.left = false;
                this.right = false;
            };

            base.addEventListener("touchend", resetJoystick);
            base.addEventListener("touchcancel", resetJoystick);
    }

    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
            }
        }
    }
}