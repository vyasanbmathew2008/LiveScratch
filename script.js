/* =========================================
   ELEMENTS
========================================= */

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

const gameContainer =
    document.getElementById("game");

const stopBtn =
    document.getElementById("stopBtn");

const status =
    document.getElementById("status");

const statusText =
    document.getElementById("statusText");

const statusIcon =
    document.getElementById("statusIcon");


/* =========================================
   VARIABLES
========================================= */

let selectedFile = null;

let scaffolding = null;


/* =========================================
   FILE INPUT
========================================= */

fileInput.addEventListener(
    "change",
    function () {

        if (
            fileInput.files &&
            fileInput.files.length > 0
        ) {

            handleFile(
                fileInput.files[0]
            );

        }

    }
);


/* =========================================
   DRAG OVER
========================================= */

dropZone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        dropZone.classList.add(
            "dragover"
        );

    }
);


/* =========================================
   DRAG LEAVE
========================================= */

dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove(
            "dragover"
        );

    }
);


/* =========================================
   DROP
========================================= */

dropZone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );

        const files =
            event.dataTransfer.files;

        if (
            files &&
            files.length > 0
        ) {

            handleFile(files[0]);

        }

    }
);


/* =========================================
   HANDLE FILE
========================================= */

function handleFile(file) {

    /*
        Check extension
    */

    if (
        !file.name
            .toLowerCase()
            .endsWith(".sb3")
    ) {

        showStatus(
            "Please select a valid .sb3 file.",
            "❌"
        );

        return;

    }


    /*
        Save file
    */

    selectedFile = file;


    /*
        Display information
    */

    fileName.textContent =
        file.name;

    fileSize.textContent =
        formatBytes(file.size);


    /*
        Show project section
    */

    projectInfo.classList.remove(
        "hidden"
    );


    showStatus(
        "SB3 project loaded successfully.",
        "✅"
    );

}


/* =========================================
   PLAY GAME
========================================= */

previewBtn.addEventListener(
    "click",
    async function () {

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
                Show game container
            */

            gameSection.classList.remove(
                "hidden"
            );


            /*
                Remove previous game
            */

            gameContainer.innerHTML = "";


            /*
                Check TurboWarp library
            */

            if (
                typeof Scaffolding ===
                "undefined"
            ) {

                throw new Error(
                    "TurboWarp runtime could not be loaded."
                );

            }


            /*
                Create runtime
            */

            scaffolding =
                new Scaffolding();


            /*
                Set stage size
            */

            scaffolding.width =
                480;

            scaffolding.height =
                360;


            /*
                Keep aspect ratio
            */

            scaffolding.resizeMode =
                "preserve-ratio";


            /*
                Setup runtime
            */

            scaffolding.setup();


            /*
                Put game into our div
            */

            scaffolding.appendTo(
                gameContainer
            );


            /*
                Read SB3 file
            */

            const buffer =
                await selectedFile.arrayBuffer();


            /*
                Load Scratch project
            */

            await scaffolding.loadProject(
                buffer
            );


            /*
                Start game
            */

            scaffolding.greenFlag();


            showStatus(
                "Game started successfully!",
                "🎮"
            );

        }

        catch (error) {

            console.error(
                "SB3 Error:",
                error
            );


            showStatus(
                "Failed to load game: " +
                error.message,
                "❌"
            );

        }

    }
);


/* =========================================
   STOP GAME
========================================= */

stopBtn.addEventListener(
    "click",
    function () {

        if (scaffolding) {

            try {

                scaffolding.stopAll();

            }

            catch (error) {

                console.error(error);

            }

        }


        gameContainer.innerHTML = "";


        showStatus(
            "Game stopped.",
            "⏹️"
        );

    }
);


/* =========================================
   REMOVE PROJECT
========================================= */

removeBtn.addEventListener(
    "click",
    function () {

        /*
            Stop running game
        */

        if (scaffolding) {

            try {

                scaffolding.stopAll();

            }

            catch (error) {

                console.error(error);

            }

        }


        /*
            Clear game
        */

        gameContainer.innerHTML = "";


        /*
            Clear variables
        */

        selectedFile = null;

        scaffolding = null;


        /*
            Reset input
        */

        fileInput.value = "";


        /*
            Hide sections
        */

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


/* =========================================
   DOWNLOAD BUTTON
========================================= */

convertBtn.addEventListener(
    "click",
    function () {

        if (!selectedFile) {

            showStatus(
                "Please upload an SB3 file first.",
                "❌"
            );

            return;

        }


        /*
            Not implemented yet.
        */

        showStatus(
            "The SB3 → standalone HTML packager will be added next.",
            "ℹ️"
        );

    }
);


/* =========================================
   STATUS MESSAGE
========================================= */

function showStatus(
    message,
    icon = "ℹ️"
) {

    statusText.textContent =
        message;

    statusIcon.textContent =
        icon;

    status.classList.remove(
        "hidden"
    );

}


/* =========================================
   FORMAT FILE SIZE
========================================= */

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
