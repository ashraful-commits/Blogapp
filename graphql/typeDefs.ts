export const typeDefs = `#graphql

    type DeleteResponse {
        success: Boolean!
        message: String!
    }

    type Link {
        id: String
        title: String
        description: String
        url: String
        imageURL: String
        createdAt: String
        categories: String
        userId: String
        bookmarkedBy: [User]
        user : User
    }

    type User {
        id : String!
        email : String!
        name : String
        image : String
        createdAt : String
        role : String
        links: [Link]
        bookmarks: [Link]
    }

    type Query {
        link(id: String!): Link
        links: [Link]!

        users : [User]
        user(id: String!): User
    }

    type Mutation {

        addLink(
        id: String
        title: String!
        description: String!
        categories: String!
        imageURL: String!
        url: String!
        userId: String!
        ): Link

        updateLink (
            id: String!
            title: String
            description: String
            url: String
            categories: String
            imageURL: String
        ) : Link

        deleteLink (
            id: String!
        ) : Link

        addToBookmark(
            userId: String!
            linkId: String!
        ): Link

        removeFromBookmark(userId: String!, linkId: String!): Link!

        updateUserRole(id: ID!, role: String!): User!

        deleteUser (
            id: String!
        ) : User

    }
`;
