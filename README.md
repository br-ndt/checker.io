<img src="https://github.com/br-ndt/checker.io/blob/main/images/app-title.png" width="200">

A WebSocket-based, React rendition of the classic head-to-head board game.

Bootstrapped using [Launch Academy's Engage](https://github.com/LaunchAcademy/generator-engage)

<img src="https://github.com/br-ndt/checker.io/blob/main/images/Board.png" width="300">

## Installation

Your system must have an installation of Postgres/PSQL of v14 or higher.
You will need to create a `.env` file in the `server` directory, containing the following field:
`SESSION_SECRET: "[INSERT ANY STRING]"`

Then:

```
createdb checker.io_development
yarn install
yarn db:reset
yarn dev
```

## Usage

You will need to register an account to access the app, from which point it will create a new Match and place you within its corresponding room.
Tokens are movable, however Player 2 (red) takes their turn first, so you will need an opponent to enter your Match room and take their turn.

Jumping/eliminating Pawns is in game, as is "King Me" logic, however there is currently no evaluation of the win condition. Constraints on what moves can be made following successful jumps are also needed. The chat component is also currently placeholder.

That said, enjoy!
