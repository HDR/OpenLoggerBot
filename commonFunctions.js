const sqlite3 = require("sqlite3");

module.exports = {
    eventState: function(guild, event) {
        let db = new sqlite3.Database('config.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
        return new Promise((resolve) => {
            db.serialize(() => {
                db.all(`SELECT "${event}" FROM "${guild}"`, (err, val) => {
                    switch(val[0][event]) {
                        default:
                            resolve(val[0][event]);
                            break;
                        case 0:
                            resolve(false);
                            break;
                        case 1:
                            resolve(true);
                            break;
                    }
                })
            })
        })
    },

    tableExists: async function (guild) {
        let db = new sqlite3.Database('config.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
        return new Promise((resolve) => {
            db.serialize(() => {
                db.all(`PRAGMA table_info(${guild});`, (err, val) => {
                    if(val.length === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                })
            })
        })
    }

}



