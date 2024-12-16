import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const { props } = await readBody(event);

  const apikey = 'yUyNX1yV1LfK0WF1xdpdP7OEhv0Cv7qgYCGn7MxpsTw';

  try {
    const response = await fetch(
      `https://trefle.io/api/v1/plants?token=${apikey}&filter[scientific_name]=${props.plant.slakte}%20${props.plant.art}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const fetchData = await response.json();

    try {
      const response = await fetch(
        `https://trefle.io/api/v1/plants/${fetchData.data[0].id}?token=${apikey}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return { error: true };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return { error: true };
  }
});
