const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCart = document.getElementById("template-cart").content;
const fragment = document.createDocumentFragment();
let cart = {};

/* Se ejecuta la funcion getShopingCart al iniciar la pagina */
document.addEventListener("DOMContentLoaded", () => {
  getShopingCart();
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart")); //TRAEMOS LOS PRODUCTOS QUE ESTAN ALMACENADOS EN EL LOCALSTORAGE
    viewCart();
  }
});

/* CAPTURAMOS EL EVENTO CLICK DE LAS CARDS PARA AGREGAR UN PRODUCTO */
cards.addEventListener("click", (event) => {
  addCart(event);
});

items.addEventListener("click", (e) => {
  btnAcction(e);
});

/* Datos de productos */
const getShopingCart = async () => {
  try {
    let url = "json/main.json";
    let response = await fetch(url);
    let data = await response.json();
    viewCard(data);
  } catch (error) {
    console.log(error);
  }
};

/* Visualizacion de prouctos por tarjeta */
const viewCard = (data) => {
  data.forEach((products) => {
    templateCard.querySelector("h5").textContent = products.title;
    templateCard.querySelector("p").textContent = products.price;
    templateCard
      .querySelector("img")
      .setAttribute("src", products.thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = products.id; //Una forma de asignar id al boton setAttribute('data-id', products.id);
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

/* Se agrega un producto al carrito de compras */
const addCart = (event) => {
  if (event.target.classList.contains("btn-dark")) {
    setCart(event.target.parentElement);
  }

  event.stopPropagation();
};

/* Calculo de suma de datos del carrito */
const setCart = (object) => {
  const product = {
    id: object.querySelector(".btn-dark").dataset.id,
    price: object.querySelector("p").textContent,
    title: object.querySelector("h5").textContent,
    quantity: 1,
  };

  if (cart.hasOwnProperty(product.id)) {
    product.quantity = cart[product.id].quantity + 1;
  }

  cart[product.id] = {
    ...product,
  };

  viewCart();
};

/* Visualizamos los datos del carrito seleccionado */
const viewCart = () => {
  items.innerHTML = "";
  Object.values(cart).forEach((product) => {
    templateCart.querySelector("th").textContent = product.id;
    templateCart.querySelectorAll("td")[0].textContent = product.title;
    templateCart.querySelectorAll("td")[1].textContent = product.quantity;
    templateCart.querySelector(".btn-info").dataset.id = product.id;
    templateCart.querySelector(".btn-danger").dataset.id = product.id;
    templateCart.querySelector("span").textContent =
      product.quantity * parseInt(product.price);

    const clone = templateCart.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  viewFooter();
  localStorage.setItem("cart", JSON.stringify(cart)); //SE AGREGA LOS PRODUCTOS AL LOCALSTORAGE
};

/* Visualización de cantidad del elementos del carrito seleccionado */
const viewFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }

  /* CANTIDAD DE PRODUCTOS AGREGADOS AL CARRITO */
  const n_quantity = Object.values(cart).reduce(
    (acc, { quantity }) => acc + quantity,
    0
  );

  /* PRECIOS DE LOS PRODUCTOS  */
  const n_price = Object.values(cart).reduce(
    (acc, { price, quantity }) => acc + quantity * price,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = n_quantity;

  templateFooter.querySelector("span").textContent = n_price;

  const clone = templateFooter.cloneNode(true);

  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btn_empty = document.getElementById("vaciar-carrito");

  btn_empty.addEventListener("click", () => {
    cart = {};
    viewCart();
  });
};

const btnAcction = (e) => {
  /* AGREGAMOS UN PRODUCTO AL CARRITO */
  if (e.target.classList.contains("btn-info")) {
    let id = e.target.dataset.id;

    const product = cart[id];
    product.quantity = cart[id].quantity + 1; //o tambien product.quantity = cart[id].quantity + 1;
    cart[id] = {
      ...product,
    };
    viewCart();
  }
  /* ELIMINAMOS UN PRODUCTO DEL CARRITO */
  if (e.target.classList.contains("btn-danger")) {
    let id_substract = e.target.dataset.id;

    const product = cart[id_substract];
    product.quantity = cart[id_substract].quantity - 1; //RESTAMOS UN PRODUCTO DEL CARRITO
    cart[id_substract] = {
      ...product,
    };
    if (product.quantity === 0) {
      delete cart[id_substract]; //ELIMINAMOS TODOS LOS PRODUCTOS DEL CARRITO
    }
    viewCart();
  }
  e.stopPropagation();
};
