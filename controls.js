class Controls{
    constructor(type){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;

        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                this.#addTouchListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }
    #addTouchListeners() {
        // Helper to attach listeners
        const setupButton = (id, direction) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const startTurning = (e) => {
                e.preventDefault();
                this[direction] = true;
                this.forward = true; // Auto-Gas on touch
            };

            const stopTurning = (e) => {
                e.preventDefault();
                this[direction] = false;
                this.forward = true; // Keep Auto-Gas on release
            };

            btn.addEventListener("touchstart", startTurning, { passive: false });
            btn.addEventListener("touchend", stopTurning, { passive: false });
            
            // Mouse support for testing on PC
            btn.addEventListener("mousedown", startTurning);
            btn.addEventListener("mouseup", stopTurning);
        };

        setupButton("btnLeft", "left");
        setupButton("btnRight", "right");
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