let selectedFile = null;

let scaffolding = null;


const fileInput =
    document.getElementById("fileInput");

const fileName =
    document.getElementById("fileName");

const playButton =
    document.getElementById("playButton");

const stopButton =
    document.getElementById("stopButton");

const status =
    document.getElementById("status");

const game =
    document.getElementById("game");


// ========================================
// FILE SELECT
// ========================================

fileInput.addEventListener(
    "change",
    function () {

        const file =
            fileInput.files[0];

        if (!file) {

            return;

        }


        if (
            !file.name
                .toLowerCase()
                .endsWith(".sb3")
        ) {

            status.textContent =
                "❌ Please select an SB3 file.";

            return;

        }


        selectedFile = file;

        fileName.textContent =
            file.name;

        status.textContent =
            "✅ SB3 loaded. Click Play Game.";

    }
);


// ========================================
// PLAY
// ========================================

playButton.addEventListener(
    "click",
    async function () {

        if (!selectedFile) {

            status.textContent =
                "❌ Select an SB3 file first.";

            return;

        }


        try {

            status.textContent =
                "⏳ Starting Scratch runtime...";


            // Remove previous runtime

            if (scaffolding) {

                try {

                    scaffolding.stopAll();

                } catch (e) {}

            }


            game.innerHTML = "";


            // ====================================
            // CREATE TURBOWARP SCAFFOLDING
            // ====================================

            scaffolding =
                new Scaffolding.Scaffolding();


            // ====================================
            // CONFIGURATION
            // ====================================

            scaffolding.width = 480;

            scaffolding.height = 360;

            scaffolding.resizeMode =
                "preserve-ratio";

            scaffolding.editableLists =
                false;

            scaffolding.usePackagedRuntime =
                true;


            // ====================================
            // INITIALIZE
            // ====================================

            scaffolding.setup();


            // ====================================
            // ADD TO WEBSITE
            // ====================================

            scaffolding.appendTo(game);


            // ====================================
            // CONFIGURE ASSET STORAGE
            // ====================================

            const storage =
                scaffolding.storage;


            storage.addWebStore(

                [
                    storage.AssetType.ImageVector,

                    storage.AssetType.ImageBitmap,

                    storage.AssetType.Sound
                ],

                asset => {

                    return (
                        "https://assets.scratch.mit.edu/internalapi/asset/"
                        +
                        asset.assetId
                        +
                        "."
                        +
                        asset.dataFormat
                        +
                        "/get/"
                    );

                }

            );


            // ====================================
            // READ SB3
            // ====================================

            status.textContent =
                "⏳ Reading SB3 project...";


            const project =
                await selectedFile.arrayBuffer();


            // ====================================
            // LOAD PROJECT
            // ====================================

            status.textContent =
                "⏳ Loading game...";


            await scaffolding.loadProject(
                project
            );


            // ====================================
            // START GAME
            // ====================================

            scaffolding.greenFlag();


            status.textContent =
                "🎮 Game is running!";

        }

        catch (error) {

            console.error(
                "FULL ERROR:",
                error
            );


            status.textContent =
                "❌ Error: " +
                error.message;

        }

    }
);


// ========================================
// STOP
// ========================================

stopButton.addEventListener(
    "click",
    function () {

        if (!scaffolding) {

            return;

        }


        try {

            scaffolding.stopAll();

            game.innerHTML = "";

            status.textContent =
                "⏹️ Game stopped.";

        }

        catch (error) {

            console.error(error);

        }

    }
);
