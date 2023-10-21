const ObjectId = require('mongodb').ObjectId;
const mongo = require('../database/mongo');

module.exports = {
    addLocation: async (location) => {
        return await mongo.Locations.insertOne(location);
    },
    getAllLocations: async () => {
        return await mongo.Locations.find({}).limit(50).sort({"_id": -1}).toArray();
    },
    getLocationById: async (id) => {
        return await mongo.Locations.findOne({ _id: new ObjectId(id) });
    },
    editLocation: async (id, newData) => {
        return await mongo.Locations.updateOne({ _id: new ObjectId(id) }, { $set: newData },{upsert:false});
    },
    deleteLocation: async (id) => {
        return await mongo.Locations.deleteOne({ _id: new ObjectId(id) });
    },
    addLocationChild: async (locationId, childId, childData) => {
        return await mongo.Locations.updateOne({ _id: new ObjectId(locationId) }, {
            $push: {
                sections: {
                    "_id": new ObjectId(childId),
                    ...childData
                }
            }
        });
    },
    removeLocationChild : async (locationId, childId) => {
        return await mongo.Locations.updateOne({ _id: new ObjectId(locationId) }, { $pull: { sections: { "_id": new ObjectId(childId) } } });
    },
    getLocationByParentId: async (parentId) => {
        return await mongo.Locations.find({ parentid: new ObjectId(parentId) }).toArray();
    },
}
