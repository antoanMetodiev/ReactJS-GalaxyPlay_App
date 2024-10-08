import { useRef } from "react";
import style from "../CreateItem/CreateItem.module.css";
import { useLocation } from "react-router-dom";

export const CreateItem = ({
	productList,
	allProducts,
	renderGameList,
	setGameListHandler,
	setAllGamesListHandler,
}) => {

	const containerRef = useRef();
	let location = useLocation();

	// Функция за обработка на изпращането на формата
	const onSubmitFormHandler = async (event) => {
		event.preventDefault();

		// Събиране на данни от формата
		const formData = new FormData(event.target);

		const descriptionText = formData.get("description").split(",# ");
		const otherImagesUrl = formData.get("other_images_url").split(", ");

		const gameData = {
			name: formData.get("game_name"),
			price: formData.get("price"),
			imageUrl: formData.get("image_url"),
			otherImageUrl: otherImagesUrl,
			description: descriptionText,
			trailer: formData.get("trailer"),
		};

		event.target.game_name.value = "";
		event.target.price.value = "";
		event.target.image_url.value = "";
		event.target.description.value = "";
		event.target.other_images_url.value = "";
		event.target.trailer.value = "";

		try {

			let paths = location.pathname.split("/");
			paths.shift();

			//   Example:
			let specificCategory = paths[1]; // Games
			let subCategory = paths[2]; // Ps5-Games

			if (specificCategory.toLocaleLowerCase() === "games")
				specificCategory = "game";

			let concreteUrl = `https://galaxyplay-15910-default-rtdb.europe-west1.firebasedatabase.app/${specificCategory}/${subCategory}.json`;

			if (subCategory == undefined || subCategory === 'details') {
				concreteUrl = `https://galaxyplay-15910-default-rtdb.europe-west1.firebasedatabase.app/${specificCategory}.json`;
			}

			const response = await fetch(concreteUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(gameData),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			

			const result = await response.json();
			gameData._id = result.name; // в result.name се намира id-то на играта!!!

			const gameCollection = [...productList, gameData];
			renderGameList.current = true;

			if (productList.length === 18) {
				setGameListHandler([...productList]);
			} else {
				setGameListHandler(gameCollection);
				
			}

			setAllGamesListHandler([...allProducts, gameData]);
			console.log("Game added successfully");
		} catch (error) {
			console.error("Error adding game: ", error);
		}
	};


	const showGameCreateHandler = () => {
		containerRef.current.classList.remove(style['fade-out']);
		containerRef.current.classList.add(style['fade-in']);
		containerRef.current.style.display = "block";
	};

	const hideGameCreateHandler = () => {
		containerRef.current.classList.remove(style['fade-in']);
		containerRef.current.classList.add(style['fade-out']);

		setTimeout(() => {
			containerRef.current.style.display = "none";
			containerRef.current.classList.remove(style['fade-out']);
		}, 400);
	};

	return (
		<>
			<article className={style["create-game-container"]} ref={containerRef}>

				<form onSubmit={onSubmitFormHandler}>
					<span onClick={hideGameCreateHandler} className={style["x-button"]}>
						X
					</span>
					<div>
						<label htmlFor="game-name">Name of the game</label>
						<input type="text" id="game-name" name="game_name" required />
					</div>

					<div>
						<label htmlFor="price">Price (USD)</label>
						<input type="number" id="price" name="price" required />
					</div>

					<div>
						<label htmlFor="img-url">Cover Picture Url</label>
						<input type="text" id="img-url" name="image_url" required />
					</div>

					<div>
						<label htmlFor="img-url">Other Pictures Url</label>
						<input type="text" id="img-url" name="other_images_url" required />
					</div>

					<div>
						<label htmlFor="trailer-video">Trailer Video</label>
						<input type="text" id="trailer-video" name="trailer" required />
					</div>

					<div>
						<label htmlFor="description">Description</label>
						<textarea
							name="description"
							id="description"
							placeholder="Write Something..."
							required
						></textarea>
					</div>

					<button type="submit">Create Item</button>
				</form>
			</article>

			<button
				onClick={showGameCreateHandler}
				className={style["show-game-create"]}
			>
				Create Item
			</button>
		</>
	);
};

// import { useRef } from "react";
// import style from "../CreateGame/CreateGame.module.css";
// import { database } from "../../../../../../../firebase/firebase";
// import { ref, push, set } from "firebase/database";

// export const CreateGame = ({
//   gameList,
//   renderGameList,
//   setGameListHandler,
//   allGames,
// }) => {
//   const containerRef = useRef();

//   // Функция за обработка на изпращането на формата
//   const onSubmitFormHandler = async (event) => {
//     event.preventDefault();

//     // Събиране на данни от формата
//     const formData = new FormData(event.target);

//     const descriptionText = formData.get("description").split(",# ");
//     const otherImagesUrl = formData.get("other_images_url").split(", ");

//     const gameData = {
//       name: formData.get("game_name"),
//       price: formData.get("price"),
//       imageUrl: formData.get("image_url"),
//       otherImageUrl: otherImagesUrl,
//       description: descriptionText,
//       trailer: formData.get("trailer"),
//     };

//     event.target.game_name.value = "";
//     event.target.price.value = "";
//     event.target.image_url.value = "";
//     event.target.description.value = "";
//     event.target.other_images_url.value = "";
//     event.target.trailer.value = "";

//     try {
//       // Създаване на request към колекцията "game/ps5-games" и добавяне на нова игра
//       const gameListRef = ref(database, "game/ps5-games");
//       const newGameRef = push(gameListRef);
//       const resultMaybe = await set(newGameRef, gameData);

//       debugger;
//       gameData._id = newGameRef._path.pieces_[2];
//       const gameCollection = [...gameList, gameData];
//       renderGameList.current = true;

//       debugger;
//       if (gameList.length === 18) {
//         setGameListHandler([...gameList]);
//         allGames = [...allGames, gameData];
//       } else {
//         setGameListHandler(gameCollection);
//       }

//       allGames = [...allGames, gameData];

//       console.log("Game added successfully");
//     } catch (error) {
//       console.error("Error adding game: ", error);
//     }
//   };

//   // Функция за показване на формата за създаване на игри
//   const showGameCreateHandler = () => {
//     containerRef.current.style.display = "block";
//   };
//   const hideGameCreateHandler = () => {
//     containerRef.current.style.display = "none";
//   };

//   return (
//     <>
//       <article className={style["create-game-container"]} ref={containerRef}>
//         {/* <img className={style['lets-goo-image']} src={letsGooImage} alt="lets-goo-image" /> */}

//         <form onSubmit={onSubmitFormHandler}>
//           <span onClick={hideGameCreateHandler} className={style["x-button"]}>
//             X
//           </span>
//           <div>
//             <label htmlFor="game-name">Name of the game</label>
//             <input type="text" id="game-name" name="game_name" required />
//           </div>

//           <div>
//             <label htmlFor="price">Price (EU)</label>
//             <input type="number" id="price" name="price" required />
//           </div>

//           <div>
//             <label htmlFor="img-url">Game Picture Url</label>
//             <input type="text" id="img-url" name="image_url" required />
//           </div>

//           <div>
//             <label htmlFor="img-url">Other Pictures Url</label>
//             <input type="text" id="img-url" name="other_images_url" required />
//           </div>

//           <div>
//             <label htmlFor="trailer-video">Trailer Video</label>
//             <input type="text" id="trailer-video" name="trailer" required />
//           </div>

//           <div>
//             <label htmlFor="description">Description</label>
//             <textarea
//               name="description"
//               id="description"
//               placeholder="Write Something..."
//               required
//             ></textarea>
//           </div>

//           <button type="submit">Create Game</button>
//         </form>
//       </article>

//       <button
//         onClick={showGameCreateHandler}
//         className={style["show-game-create"]}
//       >
//         Create Game
//       </button>
//     </>
//   );
// };
