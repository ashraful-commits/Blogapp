import { PrismaClient } from "@prisma/client";

type LinkArgs = {
  id: string;
  title: string;
  description: string;
  url: string;
  categories: string;
  imageURL: string;
  userId: string;
};

type UserArgs = {
  id: string;
  role: string;
};

export const resolvers = {
  Query: {
    links: async (
      _parent: unknown,
      _args: unknown,
      ctx: { prisma: PrismaClient }
    ) =>
      await ctx.prisma.link.findMany({
        include: {
          user: true,
          bookmarkedBy: true,
        },
      }),

    link: async (
      _parent: unknown,
      _args: LinkArgs,
      ctx: { prisma: PrismaClient }
    ) =>
      await ctx.prisma.link.findUnique({
        where: { id: _args.id },
        include: {
          user: true,
          bookmarkedBy: true,
        },
      }),

    users: async (
      _parent: unknown,
      _args: unknown,
      ctx: { prisma: PrismaClient }
    ) =>
      await ctx.prisma.user.findMany({
        include: {
          links: true,
          bookmarks: true,
        },
      }),

    user: async (
      _parent: unknown,
      _args: LinkArgs,
      ctx: { prisma: PrismaClient }
    ) =>
      await ctx.prisma.user.findUnique({
        where: { id: _args.id },
        include: {
          links: true,
          bookmarks: true,
        },
      }),
  },

  Mutation: {
    addLink: async (
      _parent: unknown,
      _args: LinkArgs,
      ctx: { prisma: PrismaClient }
    ) => {
      // Create the link first
      const createdLink = await ctx.prisma.link.create({
        data: {
          id: _args?.id,
          title: _args.title,
          description: _args.description,
          url: _args.url,
          imageURL: _args.imageURL,
          categories: _args.categories,
          userId: _args.userId,
        },
      });

      // Fetch the user related to the link using the userId
      const user = await ctx.prisma.user.findUnique({
        where: { id: _args.userId },
      });

      // Return the created link along with the user data
      return {
        ...createdLink,
        user,
      };
    },

    addToBookmark: async (
      _parent: unknown,
      _args: { userId: string; linkId: string },
      ctx: { prisma: PrismaClient }
    ) => {
      const { userId, linkId } = _args;

      // Check if the user exists
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      // Check if the link exists
      const link = await ctx.prisma.link.findUnique({
        where: { id: linkId },
      });

      if (!user) {
        throw new Error("User not found");
      }
      if (!link) {
        throw new Error("Link not found");
      }

      // Add the link to the user's bookmarks
      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          bookmarks: {
            connect: { id: linkId },
          },
        },
        include: {
          bookmarks: true,
        },
      });

      return updatedUser.bookmarks.find((bookmark) => bookmark.id === linkId);
    },

    removeFromBookmark: async (
      _parent: unknown,
      _args: { userId: string; linkId: string },
      ctx: { prisma: PrismaClient }
    ) => {
      const { userId, linkId } = _args;

      // Check if the user exists
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      // Check if the link exists
      const link = await ctx.prisma.link.findUnique({
        where: { id: linkId },
      });

      if (!user) {
        throw new Error("User not found");
      }
      if (!link) {
        throw new Error("Link not found");
      }

      // Remove the link from the user's bookmarks
      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          bookmarks: {
            disconnect: { id: linkId },
          },
        },
      });

      // Verify the link was removed
      const stillBookmarked = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
          bookmarks: {
            some: { id: linkId },
          },
        },
      });

      if (stillBookmarked) {
        throw new Error("Failed to remove the bookmark.");
      }

      // Return the removed link
      return link;
    },

    updateLink: async (
      _parent: unknown,
      _args: LinkArgs,
      ctx: { prisma: PrismaClient }
    ) =>
      await ctx.prisma.link.update({
        where: {
          id: _args.id,
        },
        data: {
          title: _args.title,
          description: _args.description,
          url: _args.url,
          categories: _args.categories,
          imageURL: _args.imageURL,
        },
      }),

    deleteLink: async (
      _parent: unknown,
      _args: { id: string },
      ctx: { prisma: PrismaClient }
    ) => {
      try {
        const deletedLink = await ctx.prisma.link.delete({
          where: {
            id: _args.id,
          },
        });
        return deletedLink
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Failed to delete the post.",
        };
      }
    },

    updateUserRole: async (
      _parent: unknown,
      _args: UserArgs,
      ctx: { prisma: PrismaClient }
    ) => {
      try {
        // Update the user's role in the database
        const updatedUser = await ctx.prisma.user.update({
          where: { id: _args.id },
          data: { role : _args.role },
        });

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating role:", error);
        throw new Error("Failed to update role");
      }
    },

    deleteUser: async (
      _parent: unknown,
      _args: { id: string },
      ctx: { prisma: PrismaClient }
    ) => {
      const userExists = await ctx.prisma.user.findUnique({
        where: { id: _args.id },
      });

      if (!userExists) {
        throw new Error("User not found.");
      }

      // Delete related records
      await ctx.prisma.link.deleteMany({
        where: { userId: _args.id },
      });

      // Delete the user
      return await ctx.prisma.user.delete({
        where: { id: _args.id },
      });
    },
  },
};
