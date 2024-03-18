const _ = require("lodash");

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
    }
}



