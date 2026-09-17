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

/**
 * Case study de um projeto. Opcional: sem ele, não há página nem botão.
 * A ordem das secções é fixa e vive na página, não aqui. Um campo com vários
 * parágrafos separa-os por uma linha em branco. .strict() rejeita campos com
 * nome errado, para uma gralha não fazer desaparecer uma secção em silêncio.
 */
const caseStudy = z
  .object({
    umaFrase: localized,
    contexto: localized,
    problema: localized,
    // Só nos projetos de equipa (fase 4.2a). Sem o campo, a secção não aparece.
    minhaParte: localized.optional(),
    decisoes: z.array(z.object({ titulo: localized, texto: localized }).strict()).min(1),
    correuMal: localized,
    resultado: localized,
    fariaDiferente: localized,
  })
  .strict();

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
        // A descrição longa só aparece nas modais dos projetos sem case study.
        description: localized,
        // Uma frase: o que o projeto é. É o texto da linha na lista de projetos.
        resumo: localized,
        features: z.array(localized).min(1),

        // Nomes próprios ficam iguais nas duas línguas; rótulos genéricos são traduzidos.
        tech: z.array(localized).min(1),

        repoUrl: z.string().url().optional(),
        demoUrl: z.string().url().optional(),
        status: z.enum(['live', 'in-development', 'no-demo']),

        // Texto de interface (chave do i18n) mostrado num botão "?" ao lado da
        // etiqueta, na lista de projetos. Fase 4.2d: substitui o antigo "group",
        // que separava os projetos de design numa sub-secção que deixou de existir.
        nota: z.enum(['projects-design-text']).optional(),

        // Projeto alojado em servidor gratuito que precisa de aviso de arranque a frio.
        coldStart: z.boolean(),

        // Ficheiro local em assets/images/, quando existe. Nem todos os projetos tem
        // screenshot; esses nao mostram imagem nenhuma (fase 4: sem bloco de
        // recurso). O que o superRefine garante e que nao ha imagem sem alt.
        image: image().optional(),
        imageAlt: localized.optional(),

        // Página de case study. Sem este campo o projeto não gera página nem mostra o botão.
        caseStudy: caseStudy.optional(),
      })
      .superRefine((data, ctx) => {
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
        if (data.status === 'in-development' && data.demoUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'status "in-development" nao pode ter demoUrl: nao ha nada para mostrar.',
          });
        }
        // Uma imagem sem alt e um defeito de acessibilidade; um alt sem imagem e lixo.
        if (data.image && !data.imageAlt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'com "image" definida, "imageAlt" passa a ser obrigatorio.',
          });
        }
        if (!data.image && data.imageAlt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '"imageAlt" sem "image" correspondente.',
          });
        }
      }),
});

export const collections = { projects };
