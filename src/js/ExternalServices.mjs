// const baseURL = import.meta.env.VITE_SERVER_URL

// function convertToJson(res) {
//   if (res.ok) {
//     return res.json();
//   } else {
//     throw new Error("Bad Response");
//   }
// }

// export default class ProductData {
//   constructor() {
//     // this.category = category;
//     // this.path = `../json/${this.category}.json`;
//   }
//   async getData(category) {
//     const response = await fetch(`${baseURL}products/search/${category}`);
//     const data = await convertToJson(response);
//     return data.Result;
//   }
//   async findProductById(id) {
//     const products = await fetch(`${baseURL}product/${id}`);
//     const data = await convertToJson(products);
//     return data.Result;
//   }
// }


const baseURL = import.meta.env.VITE_SERVER_URL;

function getApiUrl(path) {
  if (!baseURL) {
    throw new Error("VITE_SERVER_URL is not configured.");
  }

  return `${baseURL.replace(/\/+$/, "")}/${path}`;
}

function convertToJson(res) {
  if (!res.ok) {
    throw new Error(`Product API request failed with status ${res.status}.`);
  }

  return res.json();
}

export default class ExternalServices {
  constructor() {

  }

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
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}
