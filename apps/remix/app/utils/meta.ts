import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

export const appMetaTags = (title?: string) => {
  const description = 'Clinsmart - Clínicas inteligentes';

  return [
    {
      title: title ? `${title} - Clinsmart` : 'Clinsmart',
    },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'keywords',
      content: 'Clinsmart, Assinar documentos, Assinatura digital, Assinatura eletrônica, clinicas',
    },
    {
      name: 'author',
      content: 'Clinsmart',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      property: 'og:title',
      content: 'Clinsmart - Assinatura Eletrônica de Documentos',
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: `${NEXT_PUBLIC_WEBAPP_URL()}/opengraph-image.jpg`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '',
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: `${NEXT_PUBLIC_WEBAPP_URL()}/opengraph-image.jpg`,
    },
  ];
};
