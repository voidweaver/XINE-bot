# XINE-bot

This is a Discord bot I made. There are not so many features packed in here. I just made it to learn some Node.js and how things work.

# Usage

### Prerequisites

1. Have [Node.js](https://nodejs.org) installed with npm
2. Create a new [Discord application](https://discord.com/developers/applications) and in that application, create a bot.

### Installation

1. Clone this repository
    ```shell
    $ git clone https://github.com/voidweaver/XINE-bot.git
    ```
2. Copy the bot's token and your discord ID into a JSON file named `auth.json` on the root directory<br>
   The file's content should look like:
   ```json
   {
       "token": "xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx",
       "owner": "xxxxxxxxxxxxxxxxxx"
   }
   ```
3. Install dependencies
    ```shell
    $ npm i --prod
    ```
4. Run the bot!
    ```shell
    $ npm start
    ```
