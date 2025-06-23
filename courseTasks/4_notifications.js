// Zadanie praktyczne: moduły


// 1. Napisz moduł [CommonJS] który można użyć w poniższy sposób:

// a)
// const notifications = require('./notifications); 
// notifications.success('Operacja udana');

// // b)
// const { success } = require('./notifications); 
// success('Operacja udana');

// // rezultat:
// "Sukces! Operacja udana."


// // 2. Napisz moduł [ES module] który można użyć w poniższy sposób:

// // a)
// import notifications from './notifications.js'; 
// notifications.success('Operacja udana');

// // b)
// import { success } from './notifications.js'; 
// success('Operacja udana');

// // rezultat:
// "Sukces! Operacja udana."


// commonJS
module.exports.success = (text) => console.log('Sukces! ' + text)

// es module
// const success = (text) => console.log('Sukces! ' + text);

// export {
//   success
// };
// export default {
//   success
// }

