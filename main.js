const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");

document.addEventListener("DOMContentLoaded", () => {
  // callback  > içerisinde farkli fonksiyonları caliştirir
  fetchCategories();
  fetchProduct();
});

// veri çekme isteği atma
function fetchCategories() {
  fetch("https://api.escuelajs.co/api/v1/categories")
    // Gelen veriyi işleme
    .then((res) => res.json())

    // işlenen veriyi ekrana basma
    .then((data) =>
      data.slice(0, 5).forEach((category) => {
        // console.log(category);

        const { image, name } = category; // constructor örneği
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        categoryDiv.innerHTML = `
             <img src="${image}" alt="${name}">
             <span>${name} </span>
            `;
        // oluşan divi html deki listeye ekleme
        categoryList.appendChild(categoryDiv);
      })
    ) // forEach metodu sonu

    .catch((e) => alert(e));
}

// ürünleri çekme

function fetchProduct() {
  fetch("https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 25).forEach((product) => {
        // console.log(product);
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
        <img src="${product.images[0]} " alt="${product.title}">
        <p>${product.title} </p>
        <p>${product.category.name} </p>
        <div class="product-action">
            <p class="price">$ ${product.price}</p>
            <button class="addBtn" onclick="addToBasket({id:${product.id}, title:'${product.title}', price: ${product.price}, img:'${product.images[0]}', amount: 1})">Add to Basket</button>
        </div>
        `;
        productList.appendChild(productDiv);
      })
    );
}

// sepet
let basket = [];
let total = 0;

// sepete ekleme işlemi

function addToBasket(product) {
  // sepette eğer bu elemandan varsa değişkene aktar
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);
  if (foundItem) {
    foundItem.amount++;
  } else {
    basket.push(product);
  }
}

// sepeti acma ve kapatma

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  addList();
  // toplam bilgisini güncelleme
  modalInfo.innerText = total;
}); // sepeti açar

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  // sepeti kaptınca içini temizleme
  modalList.innerHTML = "";
  // toplam değerini 0 lama
  total = 0;
}); // sepeti kapatır

// sepete listeleme fonk

function addList() {
  basket.forEach((basketItem) => {
    console.log(basketItem)
    const listItem = document.createElement("div");
    listItem.classList.add("list-item");
    //içeriğini değiştir
    listItem.innerHTML = `
    <img src="${basketItem.img}" alt="${basketItem.name}">
    <h2 class="item-name">${basketItem.title}</h2>
    <h2 class="item-price">${basketItem.price}$</h2>
    <p class="amount">Miktar: ${basketItem.amount}</p>
    <button class="delete-btn" id="del" onclick='deleteItem({id: ${basketItem.id}, price: ${basketItem.price} , amount:${basketItem.amount}})'>Delete</button>
    `;
    modalList.appendChild(listItem);
    //toplam değişkenini güncelleme
    total += basketItem.price * basketItem.amount;
  });
}

// sepette silme fonk
function deleteItem(deletedItem) {
  // console.log(deletedItem);
  basket = basket.filter((i) => i.id !== deletedItem);

  // silinen elemeanın fiyatını düşme
  total -= deletedItem.price * deletedItem.amount;

  modalInfo.innerText = total;
}

// elemanı html den kaldırma

modal.addEventListener("click", (e) => {
  if (e.target.id == "del") {
    e.target.parentElement.remove();
  }
});

// sepet listesi dısına(modal) tıklanırsa listeyi kapatma
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});
