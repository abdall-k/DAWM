// console.log("  Hello, World!  ");
// console.log("  La date du jour est : " + new Date());
// let a = 2
// let b = 3
// let s = a + b


// function somme(a,b)
// {
//     return a+b;
// }

// const carre = ((a)=>{ return a*a});
// console.log(carre(8))
// console.log(somme(6,9))
// console.log(s+"="+a+"+"+b);
// console.log(`${s}=${a}+${b}`)





"use strict";
(function () {
  window.addEventListener("load", init); // init == main

  function init() {
    // setTimeout(great,1000);
    // let name=id("nom").value;
    id("hi").addEventListener("click",great)
   
  }
  function great(x)
  {
    let name=id("nom").value;
    alert("Salut "+ x +"ça va ?");
  }

  function id(id) {
    
    return document.getElementById(id);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }
})();
