import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Tak Puzzles
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <Link href="/puzzle/4">
            <a className={styles.card}>
              <h3>4x4 Road Puzzles</h3>
            </a>
          </Link>
          <Link href="/puzzle/5">
            <a className={styles.card}>
              <h3>5x5 Road Puzzles</h3>
            </a>
          </Link>
          <Link href="/puzzle/6">
            <a className={styles.card}>
              <h3>6x6 Road Puzzles</h3>
            </a>
          </Link>
          <Link href="/puzzle/7">
            <a className={styles.card}>
              <h3>7x7 Road Puzzles</h3>
            </a>
          </Link>

          <Link href="/player/nitzel">
            <a className={styles.card}>
              <h3>Played games &rarr;</h3>
              <p>All the history</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
