const UserFilter = require('./userFilter')
class UserRepository {
    constructor(model) {
        this.model = model
    }

    all = async (request) => {
        const query = await new UserFilter(this.model.find(), request)
            .filter()
            .sort()
            .paginate()

        return query
    }

    show = async (request) => {
        return await this.model.findById(request.params.id)
    }

    findId = async (id) => {
        return await this.model.findById(id)
    }

    findByIdPassword = async (id) => {
        return await this.model.findById(id).select('+password')
    }

    findOne = async (object) => {
        return await this.model.findOne(object)
    }

    findOneEmailPassword = async (email) => {
        return await this.model.findOne({ email }).select('+password')
    }

    store = async (request) => {
        return await this.model.create(request.body)
    }

    update = async (request) => {
        return await this.model.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true
        })
    }

    delete = async (request) => {
        return await this.model.findByIdAndDelete(request.params.id)
    }
}

module.exports = UserRepository
