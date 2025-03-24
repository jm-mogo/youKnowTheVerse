<script setup>
import { ref, watch } from "vue";
const booksLength = 66;

const { dificulty, booksSpan } = defineProps([
	"dificulty",
	"booksSpan",
	"books",
]);

const bookId = ref(0);

const lives = ref(3);
const points = ref(0);
const isAnswer = ref(false);

const bookGuess = ref("");
const chapterGuess = ref("");
const verseGuess = ref("");

const book = ref({});
const text = ref({});
const visible = ref(false);

const getRandom = (number) => {
	const randomNumber = Math.floor(Math.random() * number);
	return randomNumber;
};

const changeVisible = (isVisible = !visible.value) => {
	visible.value = isVisible;
};

const getBookNT = () => {
	return getRandom(booksLength - 39) + 39 + 1;
};

const getBookOT = () => {
	return getRandom(booksLength - 27) + 1;
};

const getBook = () => {
	return getRandom(booksLength) + 1;
};

const getRandomBook = () => {
	if (booksSpan == "new") {
		bookId.value = getBookNT();
	} else if (booksSpan == "old") {
		bookId.value = getBookOT();
	} else {
		bookId.value = getBook();
	}
};

const nextVerse = () => {
	getRandomBook();
	changeVisible();
};

const cleanInputs = () => {
	bookGuess.value = "";
	chapterGuess.value = null;
	verseGuess.value = null;
};

const checkAnswer = () => {
	let isCorrect = false;

	console.log(book.value.name, text.value.chapter, text.value.verse);
	console.log(bookGuess.value, chapterGuess.value, verseGuess.value);
	console.log(dificulty);

	switch (dificulty) {
		case 1:
			isCorrect = book.value.name == bookGuess.value;
			break;
		case 2:
			isCorrect =
				book.value.name == bookGuess.value &&
				text.value.chapter == chapterGuess.value;
			break;
		case 3:
			isCorrect =
				book.value.name == bookGuess.value &&
				text.value.chapter == chapterGuess.value &&
				text.value.verse == verseGuess.value;
			break;
	}

	if (isCorrect) {
		isAnswer.value = true;
		points.value++;
	} else {
		isAnswer.value = false;
		lives.value--;
	}
	cleanInputs();
};

watch(bookId, async () => {
	if (bookId > 66 || bookId < 1) return;

	try {
		const response = await fetch(
			`https://api.getbible.net/v2/valera/${bookId.value}.json`
		);
		changeVisible(false);
		book.value = await response.json();
	} catch (error) {
		console.log(error);
	}
});

watch(book, () => {
	const chapterNumber = getRandom(book.value.chapters.length);
	const chapter = book.value.chapters[chapterNumber];
	const verseNumber = getRandom(chapter.verses.length);
	text.value = chapter.verses[verseNumber];
});

getRandomBook();

const playAgain = () => {
	getRandomBook();
	lives.value = 3;
	points.value = 0;
	visible.value = true;
};
</script>

<template>
	<div class="game-view" v-if="lives < 0">
		<h2 class="verse">No más intentos disponibles</h2>

		<p class="info">Total aciertos: {{ points }}</p>
		<p class="info">
			Dificultad:
			{{
				dificulty == 1
					? "Solo libro"
					: dificulty == 2
					? "Libro y capítulo"
					: "Libro, capítulo y versículo "
			}}
		</p>
		<br />

		<button @click="playAgain">Jugar de nuevo</button>
	</div>

	<div class="game-view" v-else>
		<div class="info">
			<p>Intentos restantes: {{ lives }}</p>
			<p>Aciertos: {{ points }}</p>
		</div>

		<h2 class="verse">{{ text.text }}</h2>

		<div class="form" v-show="!visible">
			<div>
				<div class="bookInput">
					<label for="name-guess">Libro:</label>
					<input
						v-model="bookGuess"
						list="verse-quote"
						id="name-guess"
						name="name-guess"
					/>
				</div>
				<div class="chapterInput" v-show="dificulty >= 2">
					<label for="chapter-guess">Capitulo:</label>
					<input
						v-model.number="chapterGuess"
						type="number"
						id="chapter-guess"
						name="chapter-guess"
					/>
				</div>
				<div class="verseInput" v-show="dificulty == 3">
					<label for="verse-guess">Versículo:</label>
					<input
						v-model.number="verseGuess"
						type="number"
						id="verse-guess"
						name="verse-guess"
					/>
				</div>
			</div>
			<datalist id="verse-quote">
				<option v-for="book in books" :value="book.name"></option>
			</datalist>
			<button class="btwShow" @click="changeVisible(), checkAnswer()">
				Mostrar cita
			</button>
		</div>

		<div v-show="visible" class="result">
			{{ isAnswer ? "Correcto!! 🎉🥳" : "Incorrecto!! ❌❌" }}
			<br />
			{{ book.name }} {{ text.chapter + ":" + text.verse }}
		</div>

		<button v-show="visible" @click="nextVerse">Siguiente versículo</button>
	</div>
</template>

<style>
.game-view {
	padding: 12px;
	max-width: 600px;
	margin: auto;
	margin-top: 22px;
	display: flex;
	flex-direction: column;
}
.info {
	font-size: 1.2rem;
	display: flex;
	justify-content: space-between;
}

.verse {
	margin-top: 12px;
	margin-bottom: 32px;
	font-size: 1.6rem;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.form button {
	margin-top: 22px;
	width: 300px;
	min-width: 2rem;
	font-size: 1rem;
	padding: 0.5rem 1rem;
	align-self: flex-end;
}

.bookInput,
.chapterInput,
.verseInput {
	display: flex;
}

.bookInput label,
.chapterInput label,
.verseInput label {
	width: 72px;
}

.chapterInput input,
.verseInput input {
	width: 3rem;
}

.result {
	font-size: 1.4rem;
}
</style>
