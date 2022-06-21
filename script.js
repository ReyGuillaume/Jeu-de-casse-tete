// Paramètres généraux
const container = document.querySelector(".container");
const body = document.querySelector("body");
const tailleBouteilles = randomInt(3, 7);
const nbrBouteilles = randomInt(3, 7) * 2;
const colors = ["aqua","blue","magenta","red","yellow","lime","darkorange","darkviolet","deeppink","gold","silver","brown","green","white"];

function randomInt(min, max) {
	max = Math.floor(max);
	min = Math.floor(min);
	return Math.floor(Math.random() * (max - min) + min);
}

// Création des objets
var bouteilles = [];
var shaker = [];

// ---- Shaker
for (var i = 0; i < nbrBouteilles - 1; i++) {
	let index = Math.floor(Math.random() * colors.length);
	let color = colors[index];
	colors.splice(index, 1);
	for (var j = 0; j < tailleBouteilles; j++) {
		shaker.push(color);
	}
}

// ---- Bouteilles
for (var i = 0; i < nbrBouteilles - 1; i++) {
	bouteilles.push(createBouteille(shaker));
}
bouteilles.push([]);

function createBouteille(array) {
	let bouteille = [];
	for (let i = 0; i < tailleBouteilles; i++) {
		let index = Math.floor(Math.random() * array.length);
		let color = array[index];
		array.splice(index, 1);
		bouteille.push(color);
	}
	return bouteille;
}

// Affichage
function clearBouteilles() {
	while (container.lastElementChild) {
    	container.removeChild(container.lastElementChild);
	}
}

function afficheBouteilles(bouteilles, select) {
	let tailleJus = (250 - 23) / tailleBouteilles;
	let nbr = 0;
	bouteilles.forEach(function(array) {
		let bouteille = document.createElement("div");
		bouteille.classList.add('bouteille');
		if (select >= 0 && nbr == select) {bouteille.classList.add('select');}
		bouteille.number = nbr;
		array.forEach(function(color) {
			let juce = document.createElement("div");
			juce.classList.add('couleur');
			juce.style.height = `${tailleJus}px`;
			juce.style.backgroundColor = color;
			bouteille.appendChild(juce);
		});
		container.appendChild(bouteille);
		nbr++;
	});
	var bouteilleList = document.querySelectorAll(".bouteille");
	bouteilleList.forEach((bouteille) => bouteille.addEventListener("click", selectBottle));
	if (isWin(bouteilles)) {
		finPartie();
	}
}

function loadGame(){
	clearBouteilles();
	afficheBouteilles(bouteilles, -1);
}

// Modification de bouteille
const selectedBottles = [];

function selectBottle(e) {
	let array = e.path;
	let stop = selectedBottles.length;
	let index = 0;
	while (stop == selectedBottles.length && index < array.length) {
		if (array[index].classList.contains("bouteille")) {
			array[index].classList.add("select");
			selectedBottles.push(array[index].number);
		}
		index++;
	}
	if (selectedBottles.length % 2 == 0) {
		let bouteilleA = selectedBottles[selectedBottles.length - 2];
		let bouteilleB = selectedBottles[selectedBottles.length - 1];
		bouteilles = verseCouleur(bouteilles, bouteilleA, bouteilleB);
		clearBouteilles();
		afficheBouteilles(bouteilles, bouteilleA);

		let select = document.querySelector(".select");
		select.classList.remove("select");
	}
}

function verseCouleur(array, A, B) {
	let bouteilleA = array[A];
	let bouteilleB = array[B];
	let temp = bouteilleA[0];
	let i = 0;
	while (i < bouteilleA.length && bouteilleA[i] == temp) {
		i++;
	}
	if (bouteilleB.length + i <= tailleBouteilles) {
		for (var j = i; j > 0; j--) {
			array[A].shift();
			array[B].unshift(temp);
		}
	}
	return array;
}

// Fin de partie
function isWin(array) {
	let win = true;
	let i = 0;
	while (win == true && i < array.length) {
		let arr = array[i];
		if (arr.length > 0) {
			let test = arr[0];
			let j = 1;
			while (win == true && j < arr.length) {
				if (arr[j] != test || arr.length < tailleBouteilles) {
					win = false;
				}
				j++;
			}
		}
		i++;
	}
	return win;
}

function finPartie() {
	let winDiv = document.createElement("div");
	winDiv.classList.add('winMessage');
	let winMessage= document.createElement("h1");
	winMessage.textContent = "Felicitation !";
	let coupMessage= document.createElement("h3");
	coupMessage.textContent = `Tu as gagné en ${selectedBottles.length} coups !`;
	winDiv.appendChild(winMessage);
	winDiv.appendChild(coupMessage);
	body.appendChild(winDiv);
}

loadGame();