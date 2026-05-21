// "use strict";

// (function () {
//     window.addEventListener("load", init);

//     function init() {
//         id("b1").addEventListener("click", change);
//     }

//     function change() {
//         qs("p").style.color = "red";
//         qs("h2").style.color = "blue";
//     }

//     function id(name) {
//         return document.getElementById(name);
//     }

//     function qs(selector) {
//         return document.querySelector(selector);
//     }
// })();


//refactored code

"use strict";
(function () {
    const id = name => document.getElementById(name);
    const qs = selector => document.querySelector(selector);
    
    const change = () => {
        qs("p").style.color = "red";
        qs("h2").style.color = "blue";
    };
    
    const init = () => {
        id("b1").addEventListener("click", change);
    };
    
    window.addEventListener("load", init);
})();