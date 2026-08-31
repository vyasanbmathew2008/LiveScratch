const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");

const projectInfo = document.getElementById("projectInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");

const removeBtn = document.getElementById("removeBtn");
const previewBtn = document.getElementById("previewBtn");
const convertBtn = document.getElementById("convertBtn");

const status = document.getElementById("status");
const statusText = document.getElementById("statusText");

let selectedFile = null;


// File input
fileInput.addEventListener("change", () => {

    if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
    }

});


// Drag & drop
dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("dragover");

});


dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragover");

});


dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if (file) {
        handleFile(file);
    }

});


// Process selected file
function handleFile(file) {

    if (!file.name.toLowerCase().endsWith(".sb3")) {

        showStatus("Please select a valid .sb3 file.");

        return;
    }

    selectedFile = file;

    fileName.textContent = file.name;

    fileSize.textContent = formatBytes(file.size);

    projectInfo.classList.remove("hidden");

    showStatus("SB3 project loaded successfully.");

}


// Remove project
removeBtn.addEventListener("click", () => {

    selectedFile = null;

    fileInput.value = "";

    projectInfo.classList.add("hidden");

    status.classList.add("hidden");

});


// Preview
previewBtn.addEventListener("click", () => {

    if (!selectedFile) {
        return;
    }

    showStatus(
        "Preview support will be added with the Scratch/TurboWarp runtime."
    );

});


// Convert
convertBtn.addEventListener("click", () => {

    if (!selectedFile) {
        return;
    }

    showStatus(
        "The SB3 packager will be connected here next."
    );

});


// Status
function showStatus(message) {

    statusText.textContent = message;

    status.classList.remove("hidden");

}


// Format file size
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
        Math.floor(Math.log(bytes) / Math.log(1024));

    return (
        (bytes / Math.pow(1024, index)).toFixed(2)
        + " "
        + units[index]
    );

}
