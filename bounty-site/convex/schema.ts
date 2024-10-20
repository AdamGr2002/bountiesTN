import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bounties: defineTable({
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
    status: v.string(),
    communicationMethod: v.string(),
    communicationValue: v.string(),
    winningSolution: v.optional(
      v.object({
        id: v.string(),
        content: v.string(),
        submitter: v.object({
          id: v.string(),
          name: v.string(),
          avatar: v.string(),
        }),
      })
    ),
  }),
  solutions: defineTable({
    bountyId: v.id("bounties"),
    content: v.string(),
    submitter: v.object({
      id: v.string(),
      name: v.string(),
      avatar: v.string(),
    }),
  }).index("by_bounty", ["bountyId"]),
});
