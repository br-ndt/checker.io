# checker.io

A WebSocket-based, React rendition of the classic head-to-head board game.

Bootstrapped using [Launch Academy's Engage](https://github.com/LaunchAcademy/generator-engage)

## Installation

This will require your system to have an installation of Postgres/PSQL of v14 or higher.

```
createdb checker.io_development
yarn install
yarn db:reset
yarn dev
```

## Usage

You will need to register an account to access the app, from which point it will create a new Match and place you within its corresponding room.
Tokens are movable, however Player 2 (red) takes their turn first, so you will need an opponent to enter your Match room and take their turn.

Jumping/eliminating Pawns is in game, as is "King Me" logic, however there is current no evaluation of the win condition and King'd Pawns cannot yet move backwards. Additionally, need to add subsequent jumping upon a successful jump.

That said, enjoy!
