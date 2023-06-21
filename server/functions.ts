// -- GLOBAL FUNCTIONS

// export const getPhoneNumber = async (identifier: string, cb: any) => {
//   await exports["mysql-async"].mysql_fetch_scalar(
//     `SELECT users.phone_number FROM users WHERE users.identifier = "${identifier}"`,
//     {},
//     (result: string) => {
//       cb(result);
//     }
//   );
// };

export const getPhoneNumber = (identifier: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"]
            .mysql_fetch_scalar(
                `SELECT users.phone_number FROM users WHERE users.identifier = @identifier`, // SQL Query
                { "@identifier": identifier }, // Parameters
                (result: string) => {
                    resolve(result); // Handle result
                }
            );
    });

export const getIdentifierByPhoneNumber = (number: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"]
            .mysql_fetch_scalar(
                `SELECT users.identifier FROM users WHERE users.phone_number = @number`, // SQL Query
                { "@number": number }, // Parameters
                (result: string) => {
                    resolve(result); // Handle result
                }
            );
    });

// -- CONTACTS

export const getContactsByIdentifier = (identifier: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"]
            .mysql_fetch_all(
                `SELECT * FROM gksphone_users_contacts WHERE gksphone_users_contacts.identifier = @identifier`, // SQL Query
                { "@identifier": identifier }, // Parameters
                (result: string) => {
                    resolve(result); // Handle result
                }
            );
    });

export const getContactId = (identifier: string, number: string): Promise<any> =>
    new Promise<number>((resolve) => {
        exports["mysql-async"].mysql_fetch_scalar(
            `SELECT id FROM gksphone_users_contacts WHERE gksphone_users_contacts.identifier = @identifier AND gksphone_users_contacts.number = @number`, // SQL Query
            { "@identifier": identifier, "@number": number }, // Parameters
            (result: number) => {
                resolve(result); // Handle result
            }
        );
    });

export const insertContact = (identifier: string, number: string, displayName: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_insert(
            `INSERT INTO gksphone_users_contacts (\`identifier\`, \`number\`,\`display\`) VALUES(@identifier, @number, @displayName)`, // SQL Query
            { "@identifier": identifier, "@number": number, "@displayName": displayName }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    });

export const getContactByIdentifierAndNumber = (identifier: string, number: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_fetch_all(
            `SELECT * FROM gksphone_users_contacts WHERE identifier = @identifier AND number = @number`, // SQL Query
            { "@identifier": identifier, "@number": number }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    });

export const updateContactById = (id: string, identifier: string, number: string, displayName: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_execute(
            `UPDATE gksphone_users_contacts SET number = @number, display = @displayName WHERE identifier = @identifier AND id = @id`, // SQL Query
            { "@number": number, "@displayName": displayName, "@identifier": identifier, "@id": id }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    });

export const removeContactByIdentifierAndNumber = (identifier: string, number: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_fetch_all(
            `DELETE FROM gksphone_users_contacts WHERE identifier = @identifier AND number = @number`, // SQL Query
            { "@identifier": identifier, "@number": number }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    });

export const getContactById = (id: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_fetch_scalar(
            `SELECT * FROM gksphone_users_contacts WHERE id = @id`, // SQL Query
            { "@id": id }, // Parameters
            (result: number) => {
                resolve(result) // Handle result
            }
        );
    })
    //return exports["mysql-async"].query_async("SELECT * FROM phone_users_contacts WHERE id = ?", [id]);

export const removeContactById = (id: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_execute(
            `DELETE FROM phone_users_contacts WHERE id = @id`, // SQL Query
            { "@id": id }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    })

// -- MESSAGES

export const getConversations = (identifier: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_fetch_all(
            `select pm.* from gksphone_messages pm JOIN (select max(gksphone_messages.id) as \`id\` from gksphone_messages LEFT JOIN users ON users.identifier = @identifier where receiver = users.phone_number GROUP BY transmitter LIMIT 100) pm2 ON pm.id = pm2.id ORDER BY pm.id DESC`, // SQL Query
            { "@identifier": identifier }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    });

export const getConversation = (identifier: string, number: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_fetch_all(
            `select gksphone_messages.* from gksphone_messages LEFT JOIN users ON users.identifier = @identifier where receiver = users.phone_number AND transmitter = @number LIMIT 100`, // SQL Query
            { "@identifier": identifier, "@number": number }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    });

export const insertMessage = (transmitter: string, receiver: string, message: string, owner: boolean, date: string): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_insert(
            `INSERT INTO gksphone_messages (transmitter,receiver,message,isRead,owner,\`time\`) VALUES (@transmitter,@receiver,@message,@owner,@owner,@date)`, // SQL Query
            { "@transmitter": transmitter, "@receiver": receiver, "@message": message, "@owner": owner, "@date": date }, // Parameters
            (result: string) => {
                resolve(result); // Handle result
            }
        );
    });

export const getMessage = (id: number): Promise<any> =>
    new Promise((resolve) => {
        exports["mysql-async"].mysql_fetch_all(
            `SELECT * FROM gksphone_messages WHERE id = @id`, // SQL Query
            { "@id": id }, // Parameters
            (result: any) => {
                resolve(result[0]); // Handle result
            }
        );
    });
