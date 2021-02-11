
import { GetServerSideProps, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from 'swr';
import fetcher from '../helpers/ui/fetcher';
import { Result } from './api/puzzle/random';


function Puzzle() {
  const { data, error } = useSWR<Result>('/api/puzzle/random', fetcher);
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const { puzzleUrl } = data;
  return (
    <div className={styles.container}>
      <Head>
        <title>Tak Puzzle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Puzzle
        </h1>
        <p className={styles.description}>
          Better solve it quick.
        </p>

        <div className={styles.grid} style={{ flexDirection: 'column' }}>
          {/* <a href="https://ptn.ninja" className={styles.card}>
            <h3>PTN.Ninja &rarr;</h3>
            <p>The foundation enabling you to puzzle.</p>
          </a> */}

          <a href={puzzleUrl} className={styles.card}>
            <p>
              <iframe
                src={puzzleUrl}
                width="100%"
                height="100%"
                style={{
                  width: "600px", // "100%",
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