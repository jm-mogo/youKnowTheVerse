<script setup>
defineProps(["updateBooksSpan", "updateDificulty", "dificulty", "booksSpan"]);
</script>

<template>
	<div class="game-menu">
		<h1 class="title">¿Conoces el versículo?</h1>

		<div class="section">
			<h2>Dificultad</h2>
			<label>
				<input
					@change="updateDificulty"
					type="radio"
					name="difficulty"
					value="1"
					:checked="dificulty == 1"
				/>
				Solo el libro
			</label>
			<label>
				<input
					@change="updateDificulty"
					type="radio"
					name="difficulty"
					value="2"
					:checked="dificulty == 2"
				/>
				Libro y capítulo
			</label>
			<label>
				<input
					@change="updateDificulty"
					type="radio"
					name="difficulty"
					value="3"
					:checked="dificulty == 3"
				/>
				Libro, capítulo y verso
			</label>
		</div>
		<div class="section">
			<h2>Libros</h2>
			<label>
				<input
					@change="updateBooksSpan"
					type="radio"
					name="books"
					value="new"
					:checked="booksSpan == 'new'"
				/>
				Nuevo testamento
			</label>
			<label>
				<input
					@change="updateBooksSpan"
					type="radio"
					name="books"
					value="old"
					:checked="booksSpan == 'old'"
				/>
				Antiguo testamento
			</label>

			<label>
				<input
					@change="updateBooksSpan"
					type="radio"
					name="books"
					value="both"
					:checked="booksSpan == 'both'"
				/>
				Ambos
			</label>
		</div>

		<slot></slot>
	</div>
</template>

<style scoped>
.game-menu {
	padding: 12px;
	max-width: 600px;
	margin: auto;
	margin-top: 22px;
	display: flex;
	flex-direction: column;
}

.title {
	text-align: center;
}

.section {
	margin-top: 12px;
	margin-bottom: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>
