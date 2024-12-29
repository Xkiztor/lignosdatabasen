import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  // Fetch URLs from your database/API

  // const client = useSupabaseClient();
  const client = await serverSupabaseClient(event);

  const { data, error } = await client.from('lignosdatabasen').select().eq('hidden', false);

  if (error) {
    console.error(error);
  }

  return data.map((planta) => ({
    loc: `/planta/${planta.slakte}/${planta.art.replace(/ /g, '+')}${
      planta.sortnamn ? '/' : ''
    }${planta.sortnamn.replace(/ /g, '+')}`,
    lastmod: planta.ändrad,
    changefreq: 'weekly',
    priority: 0.9,
  }));
});
