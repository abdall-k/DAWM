// "use strict";
// (function () {
//     window.addEventListener("load", init); // init = main

//     function init() {
//         id("hi").addEventListener("click", sayHi);
//     }

//     function sayHi() {
//         let name = id("nom").value;
//         let p = qs("p");
//         p.innerHTML = "Bonjour " + name;
//     }

//     function id(id) {
//         return document.getElementById(id);
//     }

//     function qs(selector) {
//         return document.querySelector(selector);
//     }
// })();





// ==================



"use strict";
(function () {
    window.addEventListener("load", init);

    function init() {
        id("b1").addEventListener("click", addClass);
    }

    function addClass() {
        id("actor").classList.toggle("mystery");
    }

    function id(id) {
        return document.getElementById(id);
    }
})();