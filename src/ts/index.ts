import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

async function main() {
  console.log(serverUrl)
  console.log(fetchProducts());
  const productsList =fetchProducts()
  listProducts(await productsList);
}
async function fetchProducts(): Promise<Product[]> {

  try {
    const reponse = await fetch(`${serverUrl}/products`)
    const products = await reponse.json()
    return products
  }

  catch (error) {
    console.error("Failed to fetch products", error);
    return []
  }

}
function listProducts(products:Product[]):void{
  const productContainer = document.getElementById("product-container");
  if(!productContainer){
    console.error("Product container not found")
    return
  }
  productContainer.innerHTML= products.map(product=>createCard(product) ).join("")


}
function formatPrice(price:Number){
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatInstallment(installment:Number[]){
  return `até ${installment[0]}x de ${formatPrice(installment[1])}`
}

function createCard(product:Product):string{
  return `<div class="product-card">
            <img src="${product.image}" alt="">
            <div class="product-card__description">
              <h3>${product.name}</h3>
              <p  class="price">${formatPrice(product.price)}<p>
              <p>${formatInstallment(product.parcelamento)}</p>
              <button>Comprar</button>
            </div>
          </div>`
}

document.addEventListener("DOMContentLoaded", main);
