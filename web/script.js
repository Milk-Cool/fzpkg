const NAME_META = "meta.txt";
const PREFIX_DATA = "data/";
const PREFIX_SCRIPTS = "scripts/";
const POSTFIX_FAP = ".fap"; // Check for no slashes in path!

let flipper = null;

let reader;
let connected = false;

const fileEl = document.querySelector("#file");
document.querySelector("#label_file").style.display = "none";

// Write text to Flipper
const textEncoder = new TextEncoderStream();
let writableStreamClosed;
let writer;

const writeText = data => {
	writer.write((new TextEncoder()).encode(data));
};
const writeRaw = data => {
	writer.write(data);
}
const send = text => writeText(text + "\r\n");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const send50 = async text => {
	send(text);
	await delay(50);
}

const writeFile = async (path, contents) => {
	console.log(path + "EOL");
	for(let i = 1; i < path.lastIndexOf("/"); i++)
		if(path[i] == "/")
			await send50("storage mkdir " + path.slice(0, i));
	await send50("storage remove " + path);
	await writeText("storage write_chunk " + path + " " + contents.length + "\r");
	await delay(50);
	writeRaw(contents);
}

const main = async () => {
	if(flipper === null){
		flipper = await navigator.serial.requestPort({ "filters": [{ "usbVendorId": 0x0483 }] });
		await flipper.open({ "baudRate": 9600 });
	}
	navigator.serial.addEventListener("disconnect", () => {
		flipper = null;
		connected = false;
        document.querySelector("#btn_connect").style.display = "block";
        document.querySelector("#label_file").style.display = "none";
	});
	writer = flipper.writable.getWriter();
	setTimeout(async () => {
		while(flipper.readable){
			reader = flipper.readable.getReader();
			let dataIn = "";
			while(true){
				const { value, done } = await reader.read();
				if(value) {
                    connected = true;
                    document.querySelector("#btn_connect").style.display = "none";
					document.querySelector("#label_file").style.display = "block";
                }
			}
		}
	});
};

document.querySelector("#btn_connect").addEventListener("click", main);

const load = async () => {
	const tarFile = fileEl.files[0];
	const tar = new tarball.TarReader();
	const info = await tar.readFile(tarFile);
	let category = "Misc", fap, installCommands, version;
	for(let file of info) {
		if(file.type != "file") continue;
		if(file.name == NAME_META) {
			const meta = tar.getTextFile(file.name).split("\n");
			version = meta[0];
			switch(version) { // Version
				case "0":
					category = meta[1];
					break;
				default:
					console.error("Unknown meta.txt version: " + version);
					return;
			}
		} else if(file.name.endsWith(POSTFIX_FAP) && !file.name.includes("/")) {
			fap = file;
		} else if(file.name.startsWith(PREFIX_DATA)) {
			const path = "/ext/" + file.name.slice(PREFIX_DATA.length);
			await writeFile(path, tar.getFileBinary(file.name));
		} else if(file.name.startsWith(PREFIX_SCRIPTS)) {
			switch(file.name.slice(file.name.indexOf("/") + 1)) {
				case "install.txt":
					installCommands = tar.getTextFile(file.name).split("\n");
					break;
				default:
					console.error("Unknown script: " + file.name);
					return;
			}
		}
	}
	if(fap === undefined) {
		console.error("No FAP file found");
		return;
	}
	await writeFile("/ext/apps/" + category + "/" + fap.name, tar.getFileBinary(fap.name));
	for(let i of installCommands) {
		await send50(i);
	}
	alert("Success!");
};
fileEl.addEventListener("change", load);