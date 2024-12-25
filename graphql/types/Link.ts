import { objectType } from "nexus";
import { User } from "./User";


export const Link = objectType({
    name : "Link",
    definition(t) {
        t.string("id")
        t.string("title")
        t.string("description")
        t.string("url")
        t.string("categories")
        t.string("imageURL")
        t.list.field("users", {
            type : User,
            async resolve(parent, args, ctx) {
                return await ctx.prisma.link.findUnique({
                    where : {
                        id : parent.id,
                    }
                }).users()
            }
        })
    }
})