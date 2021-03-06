/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/example.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/example.js":
/*!************************!*\
  !*** ./lib/example.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n**  Fragment.js shader frame examples\n*/\n\n/* Example 1 */\n// Select image by id in document\nvar image1 = document.getElementById('example1'); // Convert image to a shaderFrame\n\nvar frame1 = new ShaderFrame({\n  tex: image1,\n  fx: ShaderFrame.FX.noiseReveal,\n  // clear: true,\n  onClear: function onClear() {\n    return console.log('clear');\n  }\n}); // Handle enter, exit and effect changes\n\ndocument.getElementById('enter1').onclick = function () {\n  return frame1.enter();\n};\n\ndocument.getElementById('exit1').onclick = function () {\n  return frame1.exit();\n};\n\ndocument.getElementById('select1').onchange = function (e) {\n  frame1.setEffect(ShaderFrame.FX[e.target.value]);\n};\n\nsetTimeout(function () {\n  return frame1.enter();\n}, 0);\n/* Example 2 */\n\nvar canvas2 = document.getElementById('example2'); // Select image by id in document\n\nvar image2 = new Image();\nimage2.src = 'assets/cat.jpg';\nvar background2 = new Image();\nbackground2.src = 'assets/back.jpg'; // Convert image to a shaderFrame\n\nvar frame2 = new ShaderFrame({\n  tex: image2,\n  background: background2,\n  fx: ShaderFrame.FX.noiseReveal,\n  canvas: canvas2\n}); // Handle enter, exit and effect changes\n\ndocument.getElementById('enter2').onclick = function () {\n  return frame2.enter();\n};\n\ndocument.getElementById('exit2').onclick = function () {\n  return frame2.exit();\n};\n\ndocument.getElementById('select2').onchange = function (e) {\n  frame2.setEffect(ShaderFrame.FX[e.target.value]);\n};\n\nsetTimeout(function () {\n  return frame2.enter();\n}, 0);\n\n//# sourceURL=webpack:///./lib/example.js?");

/***/ })

/******/ });