import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("bounties").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("bounties") },
  handler: async (ctx, args) => {
    const bounty = await ctx.db.get(args.id);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    return bounty;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    amount: v.number(),
    deadline: v.string(),
    tags: v.array(v.string()),
    poster: v.object({
      id: v.string(),
      name: v.string(),
      avatar: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const bountyId = await ctx.db.insert("bounties", {
      ...args,
      status: "open",
    });
    return bountyId;
  },
});

export const updateStatus = mutation({
  args: { id: v.id("bounties"), status: v.string() },
  handler: async (ctx, args) => {
    const { id, status } = args;
    const existingBounty = await ctx.db.get(id);
    if (!existingBounty) {
      throw new Error("Bounty not found");
    }
    await ctx.db.patch(id, { status });
  },
});

export const submitSolution = mutation({
  args: {
    bountyId: v.id("bounties"),
    content: v.string(),
    submitter: v.object({
      id: v.string(),
      name: v.string(),
      avatar: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { bountyId, content, submitter } = args;
    const existingBounty = await ctx.db.get(bountyId);
    if (!existingBounty) {
      throw new Error("Bounty not found");
    }
    if (existingBounty.status !== "open") {
      throw new Error("This bounty is not open for submissions");
    }
    const solutionId = await ctx.db.insert("solutions", {
      bountyId,
      content,
      submitter,
    });
    return solutionId;
  },
});

export const getSolutions = query({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const { bountyId } = args;
    return await ctx.db
      .query("solutions")
      .withIndex("by_bounty", (q) => q.eq("bountyId", bountyId))
      .collect();
  },
});

export const setWinningSolution = mutation({
  args: { bountyId: v.id("bounties"), solutionId: v.id("solutions") },
  handler: async (ctx, args) => {
    const { bountyId, solutionId } = args;
    const bounty = await ctx.db.get(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    const solution = await ctx.db.get(solutionId);
    if (!solution) {
      throw new Error("Solution not found");
    }
    await ctx.db.patch(bountyId, {
      status: "closed",
      winningSolution: {
        id: solutionId,
        content: solution.content,
        submitter: solution.submitter,
      },
    });
  },
});