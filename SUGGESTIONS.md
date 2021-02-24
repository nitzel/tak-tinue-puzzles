## Suggested by discord.tak
- [x] Replace player names with `You` and `Them`
- [x] 1-ply puzzles: Don't display games where the active player isn't the winning one
- [ ] Export saved data via link (e.g. https://puzzle.exegames.de/?load=some-gzipped-json-that-overwrites-localstorage) or the load-page offers you the option to add/overwrite the played puzzles
- [x] Fix browser history [This was the problem](https://github.com/vercel/next.js/issues/8107#issuecomment-517935725)
- [ ] Make it more fun to discover the Tinue
  - e.g. by rewarding the right move
  - by making the opponents move


## My todo list
- [ ] Figure out how to rebuild the deployment without stopping the server for half a minute while building
- [ ] Add a 404 page
- [ ] Improve styling - make it pretty
- [ ] Once [ptn.ninja](https://ptn.ninja) supports [Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) utilize it to apply moves, reset the board state etc
