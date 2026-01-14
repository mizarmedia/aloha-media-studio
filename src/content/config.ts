import { defineCollection, z } from 'astro:content'

const theEditCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Aloha Media Studio'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['tutorial', 'behind-the-scenes', 'tips', 'gear', 'story']).default('tips'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
})

export const collections = {
  'the-edit': theEditCollection,
}
