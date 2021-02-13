import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import useSWR from 'swr';
import fetcher from '../../helpers/ui/fetcher';
import { Result } from '../api/puzzle/random/[boardsize]';
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
  const { data, error } = useSWR<Result>(boardSize ? `/api/puzzle/random/${boardSize}` : null, fetcher);
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

      <footer className={styles.footer}>
        <a href="https://github.com/nitzel" target="_blank">
          Developed by nitzel
        </a>
      </footer>
    </div>
  );
}

export default Puzzle;