let selectedFile = null;
let scaffolding = null;


const fileInput =
    document.getElementById("fileInput");

const playButton =
    document.getElementById("playButton");

const stopButton =
    document.getElementById("stopButton");

const game =
    document.getElementById("game");

const status =
    document.getElementById("status");


// ========================================
// SELECT SB3
// ========================================

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    if (!file.name.toLowerCase().endsWith(".sb3")) {

        status.textContent =
            "Please select an .sb3 file.";

        return;
    }

    selectedFile = file;

    status.textContent =
        "Loaded: " + file.name;

});


// ========================================
// PLAY
// ========================================

playButton.addEventListener("click", async () => {

    if (!selectedFile) {

        status.textContent =
            "Select an SB3 file first.";

        return;
    }


    try {

        status.textContent =
            "Loading game...";


        // Remove old game
        game.innerHTML = "";


        // Create TurboWarp Scaffolding
        scaffolding =
            new Scaffolding.Scaffolding();


        // Game size
        scaffolding.width = 480;

        scaffolding.height = 360;

        scaffolding.resizeMode =
            "preserve-ratio";


        // Initialize
        scaffolding.setup();


        // Put game on page
        scaffolding.appendTo(game);


        // Read SB3
        const project =
            await selectedFile.arrayBuffer();


        // Load project
        await scaffolding.loadProject(
            project
        );


        // Start Scratch green flag
        scaffolding.greenFlag();


        status.textContent =
            "Game running!";


    } catch (error) {

        console.error(error);

        status.textContent =
            "Error: " + error.message;

    }

});


// ========================================
// STOP
// ========================================

stopButton.addEventListener("click", () => {

    if (scaffolding) {

        scaffolding.stopAll();

        game.innerHTML = "";

        status.textContent =
            "Game stopped.";

    }

});
