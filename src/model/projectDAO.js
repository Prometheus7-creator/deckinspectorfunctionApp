// projectDAO.js

const ObjectId = require('mongodb').ObjectId;
const mongo = require('../database/mongo');

module.exports = {
    addProject: async (project) => {
        return await mongo.Projects.insertOne(project);
    },
    getAllProjects: async () => {
        return await mongo.Projects.find({}).limit(50).sort({"_id": -1}).toArray();
    },
    getProjectById: async (id) => {
        return await mongo.Projects.findOne({ _id: new ObjectId(id) }, {files: 0});
    },
    assignProjectToUser: async (id, username) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(id) }, { $addToSet: { assignedto: username }});
    },
    unassignUserFromProject: async (id, username) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(id) }, { $pull: { assignedto: username }});
    },

   getProjectsByNameCreatedOnIsCompletedAndDeleted: async function({name = null,createdon = null,iscomplete = false,isdeleted = false} = {}) {
    // Initialize an empty query object
        const query = {};

        // Populate the query object based on function arguments
        if (name !== null) { query.name = name; }
        if (createdon !== null) { query.createdon = createdon; }
        query.iscomplete = iscomplete;
        query.isdeleted = isdeleted;

        // Execute the query and return the result
        return await mongo.Projects.find(query)
            .sort({ editedat: -1 })
            .limit(25)
            .toArray();
 
    },

    editProject: async (projectId, newData) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(projectId) }, { $set: newData },{upsert:false});
    },

    updateProjectVisibilityStatus: async (id, isVisible) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(id) }, { $set: { isdeleted: isVisible } });
    },

    updateProjectStatus: async (id, isComplete) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(id) }, { $set: { iscomplete: isComplete } });
    },

    deleteProjectPermanently: async (id) => {
        return await mongo.Projects.deleteOne({ _id: new ObjectId(id) });
    },

    getAllFilesOfProject: async (id) => {
        return await mongo.Projects.findOne({ _id: new ObjectId(id) }, { files: 1 });
    },

    getProjectByAssignedToUserId: async (userId) => {
        return await mongo.Projects.find({ assignedto: { $in: [userId] } }).toArray();
    },

    addProjectChild: async (projectId, childId, childData) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(projectId) }, {
            $push: {
                children: {
                    "_id": new ObjectId(childId),
                    ...childData
                }
            }
        });
    },

    removeProjectChild: async (projectId, childId) => {
        console.log(projectId,childId);
        return await mongo.Projects.updateOne({ _id: new ObjectId(projectId) }, {
            $pull: {
                children: {
                    "_id": new ObjectId(childId)
                }
            }
        });
    },

    addChildInSingleLevelProject: async (projectId, childId,childData) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(projectId) }, {
            $push: {
                sections: {
                    "_id": new ObjectId(childId),
                    ...childData
                }
            }
        });
    },

   removeChildFromSingleLevelProject: async (projectId, childId) => {
        return await mongo.Projects.updateOne({ _id: new ObjectId(projectId) }, {
            $pull: {
                sections: {
                    "_id": new ObjectId(childId)
                }
            }
        });
   }    
};
