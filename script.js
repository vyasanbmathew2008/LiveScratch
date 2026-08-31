import Scaffolding from "https://unpkg.com/@turbowarp/scaffolding@latest/dist/scaffolding.mjs";


const fileInput =
    document.getElementById("fileInput");

const dropZone =
    document.getElementById("dropZone");

const projectInfo =
    document.getElementById("projectInfo");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const removeBtn =
    document.getElementById("removeBtn");

const previewBtn =
    document.getElementById("previewBtn");

const convertBtn =
    document.getElementById("convertBtn");

const gameSection =
    document.getElementById("gameSection");

const game =
    document.getElementById("game");

const stopBtn =
    document.getElementById("stopBtn");

const status =
    document.getElementById("status");

const statusIcon =
    document.getElementById("statusIcon");

const statusText =
    document.getElementById("statusText");


let selectedFile = null;

let runtime = null;


/*
=========================================
FILE INPUT
=========================================
*/

fileInput.addEventListener(
    "change",
    () => {

        if (fileInput.files.length > 0) {

            handleFile(
                fileInput.files[0]
            );

        }

    }
);


/*
=========================================
DRAG & DROP
=========================================
*/

dropZone.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        dropZone.classList.add(
            "dragover"
        );

    }
);


dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "dragover"
        );

    }
);


dropZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );

        const file =
            event.dataTransfer.files[0];

        if (file) {

            handleFile(file);

        }

    }
);


/*
=========================================
HANDLE FILE
=========================================
*/

function handleFile(file) {

    if (
        !file.name
            .toLowerCase()
            .endsWith(".sb3")
    ) {

        showStatus(
            "Please select an SB3 file.",
            "❌"
        );

        return;

    }


    selectedFile = file;

    fileName.textContent =
        file.name;

    fileSize.textContent =
        formatBytes(file.size);


    projectInfo.classList.remove(
        "hidden"
    );


    showStatus(
        "Project loaded successfully.",
        "✅"
    );

}


/*
=========================================
PLAY GAME
=========================================
*/

previewBtn.addEventListener(
    "click",
    async () => {

        if (!selectedFile) {

            showStatus(
                "Please upload an SB3 file first.",
                "❌"
            );

            return;

        }


        try {

            showStatus(
                "Loading game...",
                "⏳"
            );


            /*
                Clear previous runtime
            */

            if (runtime) {

                try {
                    runtime.stopAll();
                } catch {}

                runtime = null;

            }


            game.innerHTML = "";


            /*
                Create TurboWarp runtime
            */

            runtime =
                new Scaffolding();


            /*
                Stage size
            */

            runtime.width = 480;

            runtime.height = 360;

            runtime.resizeMode =
                "preserve-ratio";


            /*
                Setup
            */

            runtime.setup();


            /*
                Add canvas to page
            */

            runtime.appendTo(game);


            /*
                Read SB3
            */

            const project =
                await selectedFile.arrayBuffer();


            /*
                Load project
            */

            await runtime.loadProject(
                project
            );


            /*
                Start project
            */

            runtime.greenFlag();


            gameSection.classList.remove(
                "hidden"
            );


            showStatus(
                "Game started!",
                "🎮"
            );

        }

        catch (error) {

            console.error(error);

            showStatus(
                "Failed to load game: " +
                error.message,
                "❌"
            );

        }

    }
);


/*
=========================================
STOP
=========================================
*/

stopBtn.addEventListener(
    "click",
    () => {

        if (runtime) {

            try {

                runtime.stopAll();

            }

            catch (error) {

                console.error(error);

            }

        }

        game.innerHTML = "";

        showStatus(
            "Game stopped.",
            "⏹️"
        );

    }
);


/*
=========================================
REMOVE
=========================================
*/

removeBtn.addEventListener(
    "click",
    () => {

        if (runtime) {

            try {
                runtime.stopAll();
            } catch {}

        }


        runtime = null;

        selectedFile = null;

        fileInput.value = "";

        game.innerHTML = "";


        projectInfo.classList.add(
            "hidden"
        );

        gameSection.classList.add(
            "hidden"
        );

        status.classList.add(
            "hidden"
        );

    }
);


/*
=========================================
DOWNLOAD
=========================================
*/

convertBtn.addEventListener(
    "click",
    () => {

        showStatus(
            "Standalone HTML packaging is the next step.",
            "ℹ️"
        );

    }
);


/*
=========================================
STATUS
=========================================
*/

function showStatus(
    message,
    icon
) {

    statusIcon.textContent =
        icon;

    statusText.textContent =
        message;

    status.classList.remove(
        "hidden"
    );

}


/*
=========================================
FILE SIZE
=========================================
*/

function formatBytes(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        (
            bytes /
            Math.pow(
                1024,
                index
            )
        ).toFixed(2)
        +
        " "
        +
        units[index]
    );

}
