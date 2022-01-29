import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { getPuzzleStatistics, IPuzzleStatistics } from './api/puzzleStatistics';
import { GetStaticProps } from 'next';

type PuzzleStatsProps = {
  statistics: IPuzzleStatistics,
  boardSize: number
}
const PuzzleStats: React.FunctionComponent<PuzzleStatsProps> = ({ statistics, boardSize }) => {
  return <>
    {
      statistics.filter(s => s.size === boardSize)
        .sort((s1, s2) => s1.tinue_depth - s2.tinue_depth)
        .map(s =>
          <div className={styles.puzzleLinkBtn} key={`${s.size}.${s.tinue_depth}`}>

            <Link href={`/puzzle?boardSize=${s.size}&tinueDepth=${s.tinue_depth}`}>
              <a>
                {
                  s.tinue_depth === 1
                    ? `Simple road puzzles (${s.count})`
                    : `${s.tinue_depth}-ply tinuë puzzles (${s.count})`
                }
              </a>
            </Link>
          </div>
        )
    }
  </>

}

type Props = {
  statistics: IPuzzleStatistics
}

const HomeComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tak Puzzles</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Tak Puzzles
        </h1>

        <p className={styles.description}>
          Practice seeing roads and tinuës by selecting a board size and length
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>4x4 Road Puzzles</h3>
            <div className={styles.description_normal}>
              <PuzzleStats statistics={props.statistics} boardSize={4}></PuzzleStats>
            </div>
          </div>

          <div className={styles.card}>
            <h3>5x5 Road Puzzles</h3>
            <div className={styles.description_normal}>
              <PuzzleStats statistics={props.statistics} boardSize={5}></PuzzleStats>
            </div>
          </div>

          <div className={styles.card}>
            <h3>6x6 Road Puzzles</h3>
            <div className={styles.description_normal}>
              <PuzzleStats statistics={props.statistics} boardSize={6}></PuzzleStats>
            </div>
          </div>

          <div className={styles.card}>
            <h3>7x7 Road Puzzles</h3>
            <div className={styles.description_normal}>
              <PuzzleStats statistics={props.statistics} boardSize={7}></PuzzleStats>
            </div>
          </div>

          {/* <Link href="/player/nitzel">
            <a className={styles.card}>
              <h3>Played games &rarr;</h3>
              <p>All the history</p>
            </a>
          </Link> */}

          <p className={styles.description_normal}>
            Generating puzzles takes time (especially 5-ply), more will be added later.
          </p>
          <p className={styles.description_normal}>
            This website is work in progress. If you experience problems or have suggestions,
            please contact <code>nitzel#9159</code> on discord or <a className={styles.link} href="https://github.com/nitzel/tak-tinue-puzzles/issues">create an issue on github</a>
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <a className={styles.link} href="https://github.com/nitzel/tak-tinue-puzzles" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
        <br />
        <a className={styles.link} href="https://ditaktic.blogspot.com/" target="_blank" rel="noreferrer">
          Puzzles too easy?
        </a>
      </footer>
    </div>
  )
}

export default HomeComponent;

export const getStaticProps: GetStaticProps<Props> = async () => {
  console.log("Calculating puzzle statistics");
  return {
    props: {
      statistics: getPuzzleStatistics()
    },
    revalidate: 60 * 1 // Recalculate at max every 1 minutes as this is fairly costly
  }
}