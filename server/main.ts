import { ESX } from "./esx";
import { initEvents } from "./exports";
import { initHandleEvents } from "./events";
import {
    getPhoneNumber,
} from "./functions";
import listenServerEvents from "./listenServerEvents";
import iPearServer from "@ipear/server";

const secretKey = GetConvar("ipear_secretkey", "");
const endpoint = GetConvar("ipear_endpoint", "");

export const client = new iPearServer({
    secretKey: secretKey,
    endpoint: endpoint,
    logger: {
        connectionsLogs: true,
        incomingEventsLogs: true,
        wakeListLogs: true,
        outgoingEventsLogs: true,
        playersManagementLogs: true,
    },
});

listenServerEvents(); // NEW on this version!
initHandleEvents(); // init incoming events from iPear API
initEvents(); // init local server-events

/*
onNet('ipear:addNews', async (sentence: string) => {
    const source = global.source;
    const player = ESX.GetPlayerFromId(source);
    client.news.publish(sentence, player.getName(), Date.now());
});

onNet("ipear:removeNews", async (id: string) => {
    client.news.remove(id);
})
*/

/**
 * When a player use the ingame-interface and request a QR-Code
 * Tip: it can be optimized if you create a boolean "ipear_account" in your database user-table to avoid the first "getQrCode" API call.
 */
onNet("ipear:getQrCode", async () => {
    const source = global.source;
    const player = ESX.GetPlayerFromId(source);
    const send = (link: string) => {
        emitNet("ipear:qrCode", source, link);
    };

    // Request QR Code with current identifier.
    client.profiles.getQrCode(player.getIdentifier())
        .then(async (qrCodeData) => {
            send(qrCodeData.qrcode); // Send to the player
        })
        .catch(async (qrCodeError) => {
            // If not found, create an account
            if (qrCodeError == "Player not found") {
                const phoneNumber: string = await getPhoneNumber(player.getIdentifier()) as string;
                // If the player doesn't exist in iPear's database, create and get the QR Code link (generated by default on account creation)
                client.profiles
                    .create(player.getIdentifier(), player.getName(), phoneNumber)
                    .then((created) => {
                        console.log(`[ipear:getQrCode] iPear profile created for: ${player.getIdentifier()} (${player.getName()})`);
                        send(created.qrcode); // Send to the player
                    })
                    .catch((addError) => {
                        console.log(`[ipear:getQrCode] Can't create player profile (${player.getIdentifier()}) on iPear (error: ${addError})`);
                    });
            } else {
                // There is a problem with iPear service!
                console.log(`[ipear:getQrCode] Can't retrieve a new QR Code link from iPear for: ${player.getIdentifier()} (error: ${qrCodeError})`);
            }
        });
});

/**
 * When a player use the ingame-interface and request a Secret Code
 * Tip: it can be optimized if you create a boolean "ipear_account" in your database user-table to avoid the first "getSecretCode" API call.
 */
onNet("ipear:getSecretCode", async () => {
    const source = global.source;
    const player = ESX.GetPlayerFromId(source);
    const send = (code: string, expiresAt: string) => {
        emitNet("ipear:secretCode", source, code, expiresAt);
    };
    // Request Secret Code with current identifier.
    client.profiles
        .getSecretCode(player.getIdentifier())
        .then((result) => {
            send(result.code, result.expiresAt); // Send to the player
        })
        .catch(async (error) => {
            // If not found, create an account
            if (error == "Player not found") {
                const phoneNumber: string = await getPhoneNumber(player.getIdentifier()) as string;
                // If the player doesn't exist in iPear's database, create and get the Secret Code link (in the opposite of the QR Code, we have to make a new request)
                client.profiles
                    .create(player.getIdentifier(), player.getName(), phoneNumber)
                    .then(() => {
                        // Secret code isn't generated once the account is created, we need to trigger it.
                        client.profiles
                            .getSecretCode(player.getIdentifier())
                            .then((generated) => {
                                send(generated.code, generated.expiresAt); // Send to the player
                            })
                            .catch((reason) => {
                                console.log(`[ipear:getSecretCode] Can't get secret code of profile (${player.getIdentifier()}) from iPear (error: ${reason})`);
                            });
                    })
                    .catch((reason) => {
                        console.log(`[ipear:getSecretCode] Can't create player profile (${player.getIdentifier()}) on iPear (error: ${reason})`);
                    });
            } else {
                // There is a problem with iPear service!
                console.log(`[ipear:getSecretCode] Can't retrieve a new secret code from iPear for: ${player.getIdentifier()} (error: ${error})`);
            }
        });
});