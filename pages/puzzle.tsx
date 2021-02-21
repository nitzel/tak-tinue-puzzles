import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from 'swr';
import fetcher from '../helpers/ui/fetcher';
import { ErrorResult, Result, SuccessResult } from './api/puzzle';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import HowItWorks from '../components/howItWorks';
import Link from 'next/link'
import PuzzleSolutionComponent from '../components/puzzleSolution';

const isErrorResult = (result?: Result): result is ErrorResult => (result as unknown as ErrorResult)?.error !== undefined;
const isSuccessResult = (result?: Result): result is SuccessResult => !isErrorResult(result);

const getValidBoardSize = (boardSize?: string): number | null => {
  if (!boardSize) return null;

  const size = parseInt(boardSize, 10);
  if (size >= 3 && size <= 9) {
    return size;
  }
  return null;
}

const getLocalStorageKeyForPlayedPuzzles = (boardSize: number, tinueDepth: number) => {
  if (tinueDepth === 1) {
    return `playedPuzzles${boardSize}`;
  }
  return `playedPuzzles${boardSize}_depth${tinueDepth}`;
}

const savePuzzleAsCompleted = (boardSize: number, tinueDepth: number, puzzleId: number) => {
  if (!boardSize || !tinueDepth || !puzzleId) return;

  const key = getLocalStorageKeyForPlayedPuzzles(boardSize, tinueDepth);

  const playedGamesString = localStorage.getItem(key)
  const playedGames: number[] = playedGamesString ? JSON.parse(playedGamesString) : [];
  if (playedGames.includes(puzzleId)) return;

  playedGames.push(puzzleId);
  playedGames.sort((x, y) => x - y);
  localStorage.setItem(key, JSON.stringify(playedGames));
}

const getNextUnplayedPuzzle = (boardSize: number, tinueDepth: number, currentPuzzleId?: number): number | null => {
  if (!boardSize || !tinueDepth) return null;

  const key = getLocalStorageKeyForPlayedPuzzles(boardSize, tinueDepth);

  const playedGamesString = localStorage.getItem(key)
  const playedGames: number[] = playedGamesString ? JSON.parse(playedGamesString) : [];

  const lastPlayedGameId = Math.max(currentPuzzleId ?? 0, 0);
  console.log({ lastPlayedGameId });
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
  tinueDepth: number | undefined
}

const Title: React.FunctionComponent<TitleProps> = ({ boardSize, tinueDepth: plies }) => {
  const boardSizeString = boardSize ? `${boardSize}x${boardSize}` : '?x?';
  return <h2 className={styles.title_normal}>
    {plies ?? '?'}-ply {boardSizeString} Puzzle
  </h2>
}

function Puzzle() {
  const router = useRouter();
  const boardSize = getValidBoardSize(router.query.boardSize as string);
  const puzzleId = parseInt(router.query.puzzleId as string, 10);
  const tinueDepth = parseInt(router.query.tinueDepth as string, 10) || 1;

  const goToNextPuzzle = () => {
    if (!boardSize) return;
    savePuzzleAsCompleted(boardSize, tinueDepth, puzzleId);
    const nextId = getNextUnplayedPuzzle(boardSize, tinueDepth, Number.isNaN(puzzleId) ? undefined : puzzleId);
    if (!nextId) {
      throw new Error(`Failed to get the next puzzle ID (BoardSize=${boardSize} CurrentPuzzleID=${puzzleId})`);
    }
    router.replace(
      {
        query: {
          boardSize,
          tinueDepth,
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

  const { data: swrData, error: swrError } = useSWR<Result>(boardSize && puzzleId ? `/api/puzzle?boardSize=${boardSize}&puzzleId=${puzzleId}&tinueDepth=${tinueDepth}` : null, fetcher);

  const error = isErrorResult(swrData) ? swrData.error : swrError;
  const data = isSuccessResult(swrData) ? swrData : undefined;
  const { puzzleUrl, solution, bad: badPuzzle } = data ?? {};

  useEffect(() => {
    if (badPuzzle) {
      console.log("Unsuitable puzzle, navigating to next one", data);
      goToNextPuzzle();
    }
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Tak Puzzle</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <Link href="/"><a className={styles.link}>&larr; Home</a></Link>
        <Title boardSize={boardSize} tinueDepth={tinueDepth} />
        <HowItWorks movesToWin={tinueDepth} type="road" className={styles.description_normal} />
        <div className={styles.grid} style={{ flexDirection: 'column' }}>
          {
            puzzleUrl
              ? <iframe
                className={styles.puzzle_iframe}
                src={puzzleUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
              ></iframe>
              : <div className={styles.puzzle_iframe}>
                {
                  error
                    ? <div style={{ color: "red" }}>
                      An error has appeared while loading the puzzle s{boardSize}t{tinueDepth}#{puzzleId}:
                      <br />
                      <code>{error.toString()}</code>
                    </div>
                    : <span>Loading the next puzzle...</span>
                }
              </div>
          }
        </div>
        <button className={styles.btn_positive} onClick={goToNextPuzzle}>Next Puzzle</button>
        <br />
        <PuzzleSolutionComponent solution={solution} className={styles.description_normal} />
      </main>
    </div>
  );
}

export default Puzzle;