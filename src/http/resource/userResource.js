class UserResource {

    static toJsonSignup(user, req) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdIn: user.createdAt,
            links: [
                {
                    href: `${process.env.BASE_URL}/login`,
                    rel: 'login',
                    method: 'POST'
                }
            ],
        }
    }

    static toJsonAll(users, req) {
        return users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                photo: user.photo,
                createdIn: user.updatedAt,
                links: [
                    {
                        href: `${process.env.BASE_URL}/users/${user.id}`,
                        rel: 'update',
                        method: 'PUT'
                    },
                    {
                        href: `${process.env.BASE_URL}/users/${user.id}`,
                        rel: 'delete',
                        method: 'DELETE'
                    }
                ],
            }
        })
    }

    static toJson(user, req) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            createdIn: user.createdAt,
            links: [
                {
                    href: `${process.env.BASE_URL}/users/${user.id}`,
                    rel: 'update',
                    method: 'PUT'
                },
                {
                    href: `${process.env.BASE_URL}/users/${user.id}`,
                    rel: 'delete',
                    method: 'DELETE'
                }
            ],
        }
    }
}

module.exports = UserResource
