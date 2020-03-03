import { Schema } from 'mongoose';
import { UserActionModel } from "../models";
import diff from 'deep-diff';

function createSchema(schemaObject, versionKey, collection) {
    schemaObject = {
        ...schemaObject,
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: Date,
        createdBy: { type: Schema.ObjectId, ref: 'User'},
        updatedBy: { type: Schema.ObjectId, ref: 'User'},
    }
    const schema = new Schema(schemaObject, {versionKey, collection});
    schema.virtual('id').get(function () {
        return this._id.toString();
    });

    schema.set('toJSON', { virtuals: true });
    schema.set('toObject', { virtuals: true });

    schema.statics.list = async function (populate, select) {
        let result = this.find({});
        if (populate) {
            populate.forEach(i => result.populate(i))
        }
        if (select) {
            result.select(select);
        }
        result = await result.exec();
        return result ? result : []
    }

    // Build CRUD
    schema.statics.getById = async function (id, populate) {
        let result = this.findOne({_id: id});
        if (populate) {
            if (Array.isArray(populate)) {
                populate.forEach(i => result.populate(i))
            } else {
                result.populate(populate);
            }
        }
        result = await result.exec();
        return result ? result.toObject() : null;
    }

    schema.statics.createModel = async function(model, user, message) {
        model.createdBy = user;
        let result = await this.create(model);
        const action = {
            type: 'CREATE',
            user,
            description: message || "Create " + this.modelName,
            identifier: result._id,
            collectionName: this.collection.name,
            createdValue: JSON.stringify(result)
        }
        UserActionModel.create(action);
        return result ? result.toObject() : null;
    }

    schema.statics.createListModel = async function(models, user, populate) {
        let result = await this.insertMany(models.map(model => ({...model, createdBy: user})));
        if (populate) {
            await this.populate(result, populate)
        }
        let actions = [];
        if (!Array.isArray(result)) {
            const action = {
                type: 'CREATE',
                user,
                description: "Create " + this.modelName,
                identifier: result._id,
                collectionName: this.collection.name,
                createdValue: JSON.stringify(result),
            }
            actions.push(action);
        } else {
            actions = result.map(item => ({
                type: 'CREATE',
                user,
                description: "Create " + this.modelName,
                identifier: item._id,
                collectionName: this.collection.name,
                createdValue: JSON.stringify(item),
            }))
        }
        UserActionModel.insertMany(actions);
        if (Array.isArray(result)) {
            return result.map(item => item.toObject())
        }
        return result ? [result.toObject()] : []
    }

    schema.statics.deleteModel = async function(model, user) {
        const oldVersion = await this.findOne({_id: model._id, updatedAt: model.updatedAt}).exec();

        if (oldVersion) {
            let result = await this.findByIdAndDelete(model._id);
            const action = {
                type: 'DELETE',
                user,
                description: "Delete " + this.modelName,
                identifier: model._id,
                collectionName: this.collection.name,
            }
            UserActionModel.create(action);
            return result ? result.toObject() : null;
        }
        return null;
    }

    schema.statics.updateModel = async function(model, user, message) {
        const oldVersion = await this.findOne({_id: model._id, updatedAt: model.updatedAt}).exec();

        if (!oldVersion) return null;
        //Update
        model.updatedAt = new Date();
        model.updatedBy = user;
        await this.findByIdAndUpdate(model._id, model).exec();
        const result = await this.findById(model._id).exec();

        const oldValueToDiff = oldVersion.toObject();
        const newValueToDiff = result.toObject();

        delete oldValueToDiff.updatedAt;
        delete oldValueToDiff.updatedBy;
        delete oldValueToDiff.createdBy;
        delete oldValueToDiff.lastLogin;

        delete newValueToDiff.updatedAt;
        delete newValueToDiff.updatedBy;
        delete newValueToDiff.createdBy;
        delete newValueToDiff.lastLogin;

        const differ = diff(JSON.parse(JSON.stringify(oldValueToDiff)), JSON.parse(JSON.stringify(newValueToDiff)));
        if (differ) {
            const action = {
                type: 'UPDATE',
                user,
                description: message || "Update " + this.modelName,
                identifier: result._id,
                collectionName: this.collection.name,
                diff: differ,
            }
            UserActionModel.create(action);
        }
        return result ? result.toObject() : null;
    }

    schema.statics.deleteById = async function(id) {
        await this.deleteOne({_id: id});
    }

    schema.statics.getByQuery = async function(query, populate) {
        let result = null;
        if (query.id) {
            const id = query.id || query._id;
            delete query.id;
            query = {
                ...query,
                _id: id,
            }
        }
        result = this.find(query)
        if (populate) {
            populate.forEach(item => result.populate(item));
        }
        result = await result.exec();
        result = result.map(item => item.toObject())
        return result ? result : [];
    }

    schema.statics.getOneByQuery = async function (query, populate) {
        let result = null;
        if (query.id) {
            const id = query.id || query._id;
            delete query.id;
            query = {
                ...query,
                _id: id,
            }
        }
        result = this.findOne(query)
        if (populate) {
            populate.forEach(item => result.populate(item));
        }
        result = await result.exec();
        result = !!result ? result.toObject() : null;
        return result ? result : null;
    }

    return schema;
}

export default createSchema;