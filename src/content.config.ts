import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Todo o texto visível existe nas duas línguas.
 * O site legado guardava o PT no HTML e o EN num objeto JS; aqui ficam lado a lado.
 */
const localized = z.object({
  pt: z.string().min(1),
  en: z.string().min(1),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        slug: z.string().min(1),
        order: z.number().int().positive(),

        title: localized,
        // O index.html legado não tem tagline para nenhum projeto: campo previsto, sem dados de origem.
        tagline: localized.optional(),
        description: localized,
        features: z.array(localized).min(1),

        // Nomes próprios ficam iguais nas duas línguas; rótulos genéricos são traduzidos.
        tech: z.array(localized).min(1),

        repoUrl: z.string().url().optional(),
        demoUrl: z.string().url().optional(),
        status: z.enum(['live', 'in-development', 'no-demo']),

        // Projeto alojado em servidor gratuito que precisa de aviso de arranque a frio.
        coldStart: z.boolean(),

        // Imagem local (otimizável) OU par de URLs remotos do Unsplash usados pelo site legado.
        image: image().optional(),
        imageRemote: z
          .object({
            card: z.string().url(),
            modal: z.string().url(),
          })
          .optional(),
        imageAlt: localized,
      })
      .superRefine((data, ctx) => {
        if (!data.image && !data.imageRemote) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'É preciso "image" (local) ou "imageRemote" (URLs).',
          });
        }
        if (data.image && data.imageRemote) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Define só um: "image" ou "imageRemote", não os dois.',
          });
        }
        if (data.status === 'no-demo' && data.demoUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'status "no-demo" não pode ter demoUrl.',
          });
        }
        if (data.status === 'live' && !data.demoUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'status "live" exige demoUrl.',
          });
        }
      }),
});

export const collections = { projects };
