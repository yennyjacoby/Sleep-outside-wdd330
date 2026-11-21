const baseURL = import.meta.env.VITE_SERVER_URL;

function getApiUrl(path) {
  if (!baseURL) {
    throw new Error("VITE_SERVER_URL is not configured.");
  }

  return `${baseURL.replace(/\/+$/, "")}/${path}`;
}

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() { }

  async getData(category) {
    const response = await fetch(getApiUrl(`products/search/${category}`));
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    if (!id) {
      throw new Error("A product ID is required.");
    }

    const response = await fetch(
      getApiUrl(`product/${encodeURIComponent(id)}`)
    );
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(getApiUrl("checkout/"), options);
    return await convertToJson(response);
  }
}