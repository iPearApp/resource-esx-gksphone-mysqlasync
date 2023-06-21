import {ESX} from "./esx";
import {getContactId, getIdentifierByPhoneNumber, getPhoneNumber} from "./functions";
import {client} from "./main";

/**
 * Unfortunately, the GKSphone script uses encryption for its server source files.
 * We therefore need to listen in on its events to trigger data transfer to iPear.
 */
export default () => {

    onNet("gksphone:gks:addContact", async (displayName: string, number: string) => {
        const player = ESX.GetPlayerFromId(source);
        /**
         * Since we need the contactId, we need to fetch the data from our database.
         * Request the contact data 1s after receiving the event, so the contact has been added into the database
         */
        setTimeout(async () => {
            const contactId = await getContactId(player.getIdentifier(), number);
            if (contactId) {
                client.contacts.add(player.getIdentifier(), {
                    uid: contactId.toString(),
                    displayName,
                    number,
                });
            }
        }, 1000);
    });

    onNet("gksphone:updateContact", async (contactId: number, displayName: string, number: string) => {
        const player = ESX.GetPlayerFromId(source);

        client.contacts.update(player.getIdentifier(), {
            uid: contactId.toString(),
            displayName,
            number,
        });
    });

    onNet("gksphone:gks:deleteContact", async (contactId: number) => {
        const player = ESX.GetPlayerFromId(source);
        client.contacts.delete(player.getIdentifier(), contactId.toString());
    });

    onNet("gksphone:gksc:sendMessage", async (number: string, message: string) => {
        const player = ESX.GetPlayerFromId(source);
        const phoneNumber: string = await getPhoneNumber(player.getIdentifier()) as string;
        if (phoneNumber !== null) {
            // We check if the player identifier still exists to avoid sending "null" identifier
            const targetIdentifier: string = await getIdentifierByPhoneNumber(number) as string;
            if (targetIdentifier == null) return;

            client.messages.send(
                player.getIdentifier(),
                phoneNumber,
                targetIdentifier,
                number,
                false,
                message
            );
        }
    });
}
