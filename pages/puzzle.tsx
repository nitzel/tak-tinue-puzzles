import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from 'swr';
import fetcher from '../helpers/ui/fetcher';
import { Result } from './api/puzzle';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HowItWorks } from '../components/howItWorks';

const getValidBoardSize = (boardSize?: string): number | null => {
  if (!boardSize) return null;

  const size = parseInt(boardSize, 10);
  if (size >= 3 && size <= 9) {
    return size;
  }
  return null;
}

const getLocalStorageKeyForPlayedPuzzles = (boardSize: number) => {
  return `playedPuzzles${boardSize}`;
}

const savePuzzleAsCompleted = (boardSize: number, puzzleId: number) => {
  if (!boardSize || !puzzleId) return;

  const key = getLocalStorageKeyForPlayedPuzzles(boardSize);
  const playedGamesString = localStorage.getItem(key)
  const playedGames: number[] = playedGamesString ? JSON.parse(playedGamesString) : [];
  if (playedGames.includes(puzzleId)) return;
  playedGames.push(puzzleId);
  playedGames.sort((x, y) => x - y);
  localStorage.setItem(getLocalStorageKeyForPlayedPuzzles(boardSize), JSON.stringify(playedGames));
}

const getNextUnplayedPuzzle = (boardSize: number, currentPuzzleId: number): number | null => {
  if (!boardSize) return null;

  const key = getLocalStorageKeyForPlayedPuzzles(boardSize);
  const playedGamesString = localStorage.getItem(key)
  const playedGames: number[] = playedGamesString ? JSON.parse(playedGamesString) : [];

  const lastPlayedGameId = Math.max(currentPuzzleId ?? 0, 0);
  let previousId: number = lastPlayedGameId;
  playedGames.forEach(playedGameId => {
    if (playedGameId - previousId > 1) {
      return previousId + 1;
    }
    if (playedGameId > previousId) {
      previousId = playedGameId;
    }
  });
  return previousId + 1;
}

type TitleProps = {
  boardSize: number | null | undefined
}

const Title: React.FunctionComponent<TitleProps> = ({ boardSize }) => {
  const boardSizeString = boardSize ? `${boardSize}x${boardSize}` : '?x?';
  return <h2 className={styles.title_normal}>
    {boardSizeString} Puzzle
  </h2>
}

function Puzzle() {
  const router = useRouter();
  const boardSize = getValidBoardSize(router.query.boardSize as string);
  const puzzleId = parseInt(router.query.puzzleId as string, 10);
  console.log(router);
  console.log(router.query);

  const goToNextPuzzle = () => {
    if (!boardSize) return;
    savePuzzleAsCompleted(boardSize, puzzleId);
    const nextId = getNextUnplayedPuzzle(boardSize, puzzleId);
    if (!nextId) {
      throw new Error(`Failed to get the next puzzle ID (BoardSize=${boardSize} CurrentPuzzleID=${puzzleId})`);
    }
    router.replace(
      {
        query: {
          boardSize,
          puzzleId: nextId
        }
      },
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    if (router.isReady) {
      if (!router.query.puzzleId || router.query.puzzleId === "latest") {
        console.log(`puzzleId=${puzzleId}, going to the next puzzle`);
        goToNextPuzzle();
      }
    }
  });

  const { data, error } = useSWR<Result>(boardSize && puzzleId ? `/api/puzzle?boardSize=${boardSize}&puzzleId=${puzzleId}` : null, fetcher);
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  const { puzzleUrl } = data;

  return (
    <div className={styles.container}>
      <Head>
        <title>Tak Puzzle</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <Title boardSize={boardSize} />
        <HowItWorks movesToWin={1} type="road" className={styles.description_normal} />
        <div className={styles.grid} style={{ flexDirection: 'column' }}>
          <a href={puzzleUrl} className={styles.card}>
            <p>
              <iframe
                src={puzzleUrl}
                width="100%"
                height="100%"
                style={{
                  width: "600px",
                  maxWidth: "100%",
                  height: "600px",
                  maxHeight: "100vh",
                }}
                frameBorder="0"
                allowFullScreen={true}
              >
              </iframe>
            </p>
          </a>
        </div>
        <button className={styles.btn_positive} onClick={goToNextPuzzle}>Next Puzzle</button>
      </main>
    </div>
  );
}

export default Puzzle;