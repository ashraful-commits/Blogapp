import prisma from "@/prisma/db";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export type Context = {
  prisma: PrismaClient;
  req: NextApiRequest | NextRequest;
  res: NextApiResponse | Response;
};

export async function createContext(
    req: NextApiRequest | NextRequest,
    res: NextApiResponse | Response
  ): Promise<Context> {
    return {
      prisma,
      req,
      res,
    };
  }
