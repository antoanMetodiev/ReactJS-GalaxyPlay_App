import { useEffect, useRef, useState } from "react";
import style from "./SearchEngine.module.css";
import { GET } from "../../../../../../../services/service";
import { useLocation } from "react-router-dom";

let firstRender = true;

export const SearchEngine = ({
	allGamesWithPattern,
	renderGameList,
	setAllGamesWithPatternHandler,
	setAllGamesListHandler,
	allProducts,

	savedFirstCollection,
	setSavedFirstCollection,

}) => {

	let location = useLocation();

	// because allGamesWithPattern will be empty after some renders:
	const searchGameWithName = async (event) => {

		debugger;

		if (firstRender) {

			setAllGamesListHandler(allGamesWithPattern);

			let neededGames = allGamesWithPattern.filter((game) => {
				if (event.target.value.trim().length == 0) return false;

				return game.name.toLowerCase().includes(event.target.value.toLowerCase());
			});

			if (neededGames.length === 0) {
				neededGames = [];
				renderGameList.current = true;
			} else {
				renderGameList.current = false;
			}

			firstRender = false;

			setSavedFirstCollection(allGamesWithPattern);
			setAllGamesWithPatternHandler(neededGames);

		} else {
			let neededGames = allProducts.filter((game) => {

				if (event.target.value.trim().length == 0) return false;
				return game.name.toLowerCase().includes(event.target.value.toLowerCase());
			});

			if (neededGames.length === 0) {
				neededGames = [];
				renderGameList.current = true;
			} else {
				renderGameList.current = false;
			}

			setAllGamesWithPatternHandler(neededGames);
		}
	};

	return (
		<input
			onChange={searchGameWithName}
			className={style["search-engine"]}
			type="text"
			placeholder="Search..."
			id="search-engine-container-id"
		/>
	);
};
