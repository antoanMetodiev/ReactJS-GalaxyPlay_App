import { useEffect, useState } from "react";
import { database, ref, onValue } from "../../../../../../../firebase/firebase";

import style from "../Body.module.css";
import { GameItem } from "../GameItem/GameItem";

export const GameList = () => {
    const [gameList, setGameList] = useState([]);

    useEffect(() => {
        const gameListRef = ref(database, 'game/ps5-games');

        const unsubscribe = onValue(gameListRef, (snapshot) => {
            const games = snapshot.val();
            if (games) {
                const gameArray = Object.keys(games).map((key) => ({
                    _id: key,
                    ...games[key]
                }));
                setGameList(gameArray);
            } else {
                setGameList([]);
            }
        });

        return () => {
            // Cleanup функция
            unsubscribe();
        };
    }, []);

    function createGameHandler(newGame) {
        setGameList(gameList => [...gameList, newGame]);
    };

  return (
    <section className={style["game-row"]}>
      {gameList.map((game) => (
        <GameItem key={game._id} data={game} />
      ))}
    </section>
  );
};