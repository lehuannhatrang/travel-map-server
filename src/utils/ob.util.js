import _ from 'lodash';
import mongoose from 'mongoose';

class ObUtil {
    static cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj))
    };

    static removeDuplicate(arr) {
        return [...new Set(_.concat(...arr))]
    }

    static convertStrToList(txt, c = ",\s*") {
        let re = new RegExp(c);
        if (re.test(txt) === true) {
            let lst = txt.split(re);
            return lst;
        }
        return [txt]
    }

    static convertListToStr(lst, c = ", ") {
        return lst.join(c);
    }

    static getSafe(obj, keyList, defaultVal = null) {
        return _.get(obj, keyList, defaultVal);
    }

    static dump(ob) {
        console.log(JSON.stringify(ob, null, 4));
    }

    static toObsMongodb(obs) {
        return _.map(obs, (ob) => { return ob.toObject() });
    }

    static convertStrToObMongoId(id) {
        return new mongoose.Types.ObjectId(id);
    }

    static toObjectIdMongo(id) {
        return new mongoose.Types.ObjectId(id);
    }

    static indexOfOb(listObs, ob) {
        return _.findIndex(listObs, (obp) => {
            return _.isEqual(ob, obp);
        })
    }

    static isObjectIdMongo(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    static isObjectIdsMongo(ids) {
        for (let id of ids) {
            if (!ObUtil.isObjectIdMongo(id)) return false;
        }
        return true;
    }
}

export default ObUtil