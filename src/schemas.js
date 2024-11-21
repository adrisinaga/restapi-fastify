import { z } from 'zod';

export const DogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string(),
  location: z.string().min(1, 'Location is required')
});