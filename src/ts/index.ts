import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
let currentPage = 1
async function main() {
  console.log(serverUrl)
  console.log(fetchProducts(1,["Preto","Cinza"],["\\bG\\b"],["0","100"]));
  const productsList =fetchProducts(currentPage,["Preto","Cinza"],["\\bM\\b"],["0","100"])
  listProducts(await productsList);
}
async function fetchProducts(page:Number,colorsFilters:String[],sizeFilters:String[],priceFilters:String[]): Promise<Product[]> {
  let url = new URL("/products",serverUrl)
  let params = new URLSearchParams 
  params.append("_page", page.toString())
  if(colorsFilters.length > 0){
    colorsFilters.forEach(color => params.append("color", color.toString())
  )
  }
  if(priceFilters.length > 1){
  params.append("price_gte", priceFilters[0].toString())
  params.append("price_lte", priceFilters[1].toString())
  
  }
  if(sizeFilters.length > 0){
    sizeFilters.forEach(size => params.append("size_like", size.toString())
  )
  }
  url.search = params.toString()
  console.log(url)
  
  try {
    const reponse = await fetch(url)
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
function showOrderModal():void{
  let modal = document.getElementById("order-modal")
  modal.classList.add("show-modal")
  return 
}
function showFilterModal():void{
  let modal = document.getElementById("filter-modal")
  modal.classList.add("show-modal")
  return 
}

document.getElementById("order-button").addEventListener("click", showOrderModal);
document.getElementById("filter-button").addEventListener("click", showFilterModal);
document.addEventListener("DOMContentLoaded", main);
