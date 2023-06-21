# iPear (ESX | GKS-Phone | MySQL-Async)

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/iPearApp/resource-esx-gcphone-oxmysql/blob/main/LICENSE)
![Supported Node.js version: 14.x](https://img.shields.io/badge/node-16.x-brightgreen)

This is an example made with **mysql-async** and **ESX (1.2)**.
If your server doesn't work with **mysql-async** and **ESX** then you need to adapt the resource.

*Note: I'm not a FiveM expert, if the resource is not optimized or doesn't work well, any help is welcome (Issues, PR, on Discord...)* 🫶

## ⚠️ Important note

This resource has a particularity: it listens to the events of GKS-Phone. Indeed, GKS-Phone does not allow to modify the source files because they are protected. We set up listeners on the events add/edit/delete contacts and send messages.
These events are listened inside this file: [server/listenServerEvents.ts](server/listenServerEvents.ts).

You also need to add some checks of inputs to avoid any issue.

## Links
[Twitter](https://twitter.com/iPearApp) |
[Discord](https://discord.gg/nxsnx2wSbg) |
[Website](https://ipear.fr)

## Dependencies
- MySQL-Async [[github]]() (already installed on your server)
- ESX (1.2) [[github]](https://github.com/esx-framework) (already installed on your server)

### Another available examples
- [ESX | GC-Phone | OxMySQL](https://github.com/iPearApp/resource-esx-gcphone-oxmysql)

## Project setup
```shell
npm install
```

### Compiles and minifies for production
```shell
npm run build
```

## Update the SQL queries
If your database is different, you need to update [server/functions.ts](server/functions.ts) and adapt every query.

## Update inputs-checks flow
We have added some checks when receiving events from iPear, but you can improve them to add security to your server:
- [server/events/contacts.ts](server/events/contacts.ts) - Contacts events
- [server/events/messages.ts](server/events/messages.ts) - Messages events

Since every roleplay server is different, it's not possible to check all possible cases. So you need to do it on your own. (like a Discord bot)

## Production

### 1. Prepare your files and keys
#### Build the current project:
```shell
npm run build
```
This will create a "**dist**" folder where all client and server files are generated and compiled.

#### Build the [ingame-interface project](https://github.com/iPearApp/ingame-interface) with:
```shell
npm i && npm run build
```
"**dist**" folder will be created with _index.html_ and few _js/img/css files_.

We will use both "dist" folders in the next step.

#### Retrieve your "secret key" and "endpoint url" on your [Projects > Server manager](https://me.ipear.fr)

### 2. Upload on your server
* Create a resource "**ipear**" in your "**resources**" folder.
* Add **fxmanifest.lua** to the "**ipear**" folder.
* Create a folder "**html**" in the "**ipear**" folder.
* Drag and drop all **ingame-interface/dist** files built previously **inside the "html"** folder.
* Drag and drop all **fivem-resource/dist** files built previously **inside the "ipear"** folder.
* Open your **server.cfg** file:
    * Add both following lines at the top of file:
        * **set ipear_secretkey "YOUR_SECRET_KEY"**
        * **set ipear_endpoint "YOUR_ENDPOINT"**
    * Add the following line at the end of the file:
        * ensure **ipear**

### 3. Start your server
Enjoy!

## License
[MIT License](LICENSE)
