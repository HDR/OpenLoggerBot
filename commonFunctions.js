const _ = require("lodash");
const sqlite3 = require("sqlite3");
const {PermissionsBitField} = require("discord.js");

module.exports = {
    getObjectDiffKey: function (object1, object2, compareRef = false) {
        return Object.keys(object1).reduce((result, key) => {
            if(!object2.hasOwnProperty(key)) {
                result.push(key);
            } else if (_.isEqual(object1[key], object2[key])) {
                const resultKeyIndex = result.indexOf(key);

                if(compareRef && object1[key] !== object2[key]) {
                    result[resultKeyIndex] = `${key} (ref)`;
                } else {
                    result.splice(resultKeyIndex, 1);
                }
            }
            return result
        }, Object.keys(object2));
    },

    getObjectDiffValue: function (object1, object2, compareRef = false) {
        return Object.keys(object1).reduce((result, key) => {
            if(!object2.hasOwnProperty(key)) {
                result.push(key);
            } else if (_.isEqual(object1[key], object2[key])) {
                const resultKeyIndex = result.indexOf(key);

                if(compareRef && object1[key] !== object2[key]) {
                    result[resultKeyIndex] = `${key} (ref)`;
                } else {
                    result.splice(resultKeyIndex, 1);
                }
            }
            return result
        }, Object.values(object2));
    },

    isStringEmpty: function(string) {
        if(string) {
            return string
        } else {
            return 'None'
        }
    },

    eventState: function(guild, event) {
        let db = new sqlite3.Database('config.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
        return new Promise((resolve, reject) => {
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
        let ex = true;
        let db = new sqlite3.Database('config.db', sqlite3.OPEN_READONLY ,(err) => {if (err) {console.log(err.message);}});
        return new Promise((resolve, reject) => {
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



