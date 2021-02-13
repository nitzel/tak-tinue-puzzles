import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import useSWR from 'swr';
import fetcher from '../../../helpers/ui/fetcher';
import { Result } from '../../api/puzzle/[boardSize]/[puzzleId]';
import { useRouter } from 'next/router';

const getValidBoardSize = (boardSize: string | undefined): number | null => {
  if (!boardSize) return null;

  const size = parseInt(boardSize, 10);
  if (size >= 3 && size <= 9) {
    return size;
  }
  return null;
}

function Puzzle() {
  const router = useRouter();
  const boardSize = getValidBoardSize(router.query.boardSize as string);
  const puzzleId = parseInt(router.query.puzzleId as string, 10);
  const { data, error } = useSWR<Result>(boardSize && puzzleId != null ? `/api/puzzle/${boardSize}/${puzzleId}` : null, fetcher);
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
        <h1 className={styles.title}>
          {boardSize}x{boardSize} Puzzle
        </h1>
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
      </main>
    </div>
  );
}

export default Puzzle;