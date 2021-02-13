import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import useSWR from 'swr';
import fetcher from '../../helpers/ui/fetcher';
import { Result } from '../api/playergames/[name]';
import React from 'react';
import GameRow from '../../components/gameRow';

const Player: React.FunctionComponent = () => {

  const router = useRouter();
  const { name: playerName } = router.query;
  console.log(router, router.query);

  const { data, error } = useSWR<Result>(`/api/playergames/${playerName}`, fetcher);
  if (error) return <div>Failed to load: {error}</div>
  if (!data) return <div>Loading...</div>

  const { games } = data;
  return (
    <div className={styles.container}>
      <Head>
        <title>Player {playerName}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {playerName}
        </h1>
        <p className={styles.description}>Desc</p>

        <table>
          <thead>
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              games.map(game => <GameRow key={game.id} game={game}></GameRow>)
            }
          </tbody>
        </table>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/nitzel" target="_blank">
          Developed by nitzel
        </a>
      </footer>
    </div>
  );
}

export default Player;