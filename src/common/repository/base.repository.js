export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
    const doc = model.findOne(filter);

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
};


export const create = async ({
    model,
    data = [{}],
    options = { validateBeforeSave: true }
} = {}) => {
    return await model.create(data, options);
};


export const createOne = async ({
    model,
    data = {},
    options = { validateBeforeSave: true }
} = {}) => {
    const [doc] = await create({
        model,
        data: [data],
        options
    });

    return doc;
};


export const findById = async ({
    id,
    model,
    options = {}
} = {}) => {
    const doc = model.findById(id);

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
};


export const find = async ({
    filter = {},
    model,
    options = {}
} = {}) => {
    const doc = model.find(filter);

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.skip) {
        doc.skip(options.skip);
    }

    if (options.limit) {
        doc.limit(options.limit);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
};


// ==================== UPDATE ====================

export const updateOne = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {

    const doc = model.updateOne(filter, {...data,$inc:{ __v :1}}, options);

    return await doc.exec();
};


export const updateMany = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {

    const docs = model.updateMany(filter,  {...data,$inc:{ __v :1}}, options);

    return await docs.exec();
};


export const findOneAndUpdate = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {

    const doc = model.findOneAndUpdate(
        filter,
         {...data,$inc:{ __v :1}},
        options
    );

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
};


export const findByIdAndUpdate = async ({
    model,
    id,
    data = {},
    options = {}
} = {}) => {

    const doc = model.findByIdAndUpdate(
        id,
         {...data,$inc:{ __v :1}},
        options
    );

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
};


// ==================== DELETE ====================

export const deleteOne = async ({
    model,
    filter = {},
    options = {}
} = {}) => {

    const doc = model.deleteOne(
        filter,
        options
    );

    return await doc.exec();
};


export const deleteMany = async ({
    model,
    filter = {},
    options = {}
} = {}) => {

    const docs = model.deleteMany(
        filter,
        options
    );

    return await docs.exec();
};


export const findOneAndDelete = async ({
    model,
    filter = {},
    options = {}
} = {}) => {

    const doc = model.findOneAndDelete(
        filter,
        options
    );

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
};


export const findByIdAndDelete = async ({
    model,
    id,
    options = {}
} = {}) => {

    const doc = model.findByIdAndDelete(
        id,
        options
    );

    if (options.select) {
        doc.select(options.select);
    }

    if (options.populate) {
        doc.populate(options.populate);
    }

    if (options.lean) {
        doc.lean();
    }

    return await doc.exec();
};


// ==================== COUNT ====================

export const countDocuments = async ({
    model,
    filter = {}
} = {}) => {

    return await model.countDocuments(filter).exec();
};


export const estimatedDocumentCount = async ({
    model
} = {}) => {

    return await model.estimatedDocumentCount().exec();
};


// ==================== DISTINCT ====================

export const distinct = async ({
    model,
    field,
    filter = {}
} = {}) => {

    return await model.distinct(
        field,
        filter
    );
};


// ==================== EXISTS ====================

export const exists = async ({
    model,
    filter = {}
} = {}) => {

    return await model.exists(filter);
};


// ==================== AGGREGATE ====================

export const aggregate = async ({
    model,
    pipeline = [],
    options = {}
} = {}) => {

    const doc = model.aggregate(pipeline);

    if (options.allowDiskUse) {
        doc.allowDiskUse(options.allowDiskUse);
    }

    if (options.maxTimeMS) {
        doc.option({
            maxTimeMS: options.maxTimeMS
        });
    }

    return await doc.exec();
};