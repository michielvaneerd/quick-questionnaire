/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../privategooglecalendars/node_modules/@wordpress/icons/build-module/library/create.js":
/*!**********************************************************************************************!*\
  !*** ../privategooglecalendars/node_modules/@wordpress/icons/build-module/library/create.js ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);


/**
 * WordPress dependencies
 */

const create = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M16 11.2h-3.2V8h-1.6v3.2H8v1.6h3.2V16h1.6v-3.2H16z"
}));
/* harmony default export */ __webpack_exports__["default"] = (create);
//# sourceMappingURL=create.js.map

/***/ }),

/***/ "./src/modal.js":
/*!**********************!*\
  !*** ./src/modal.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MyModal": function() { return /* binding */ MyModal; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);


const multipleAnswersTypes = ['checkbox', 'radio'];
const MyModal = props => {
  const {
    title,
    answers,
    setAnswers,
    question,
    setQuestion,
    onModalClose,
    closeModal,
    type
  } = props;

  function updateAnswer(index, newValue) {
    let newAnswers = [...answers];
    newAnswers[index] = newValue;
    setAnswers(newAnswers);
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    title: title,
    onRequestClose: closeModal
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
    autoFocus: question === '' || answers.length === 0,
    label: "Question",
    value: question,
    onChange: value => setQuestion(value)
  }), answers.map((answer, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
    label: "Answer",
    autoFocus: question !== '' && index === answers.length - 1,
    key: index,
    value: answer,
    onChange: value => {
      updateAnswer(index, value);
    }
  })), multipleAnswersTypes.indexOf(type) !== -1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "link",
    onClick: () => setAnswers(answers.concat('')),
    text: "Add answer"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
    alignment: "right"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "primary",
    onClick: onModalClose
  }, "OK")));
};

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "../privategooglecalendars/node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************************************!*\
  !*** ../privategooglecalendars/node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "../privategooglecalendars/node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "../privategooglecalendars/node_modules/@wordpress/icons/build-module/library/create.js");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modal */ "./src/modal.js");



/**
 * See for source:
 * https://github.com/MarieComet/core-block-custom-attributes
 * https://developer.wordpress.org/block-editor/how-to-guides/plugin-sidebar-0/
 * https://awhitepixel.com/blog/how-to-add-post-meta-fields-to-gutenberg-document-sidebar/
 * https://wordpress.org/support/topic/how-to-create-a-gutenberg-block-with-your-own-list-inside-which-there-will-be-o/ ==> eigen list maken
 */
//import { addFilter } from '@wordpress/hooks';
//import { createHigherOrderComponent } from '@wordpress/compose';

 //import { useEntityProp } from '@wordpress/core-data';





 // const blockName = 'core/list';
// // Enable some attributes
// function setSidebarEnableAttribute(settings, name) {
//     if (name !== blockName) return settings;
//     return Object.assign({}, settings, {
//         attributes: Object.assign({}, settings.attributes, {
//             enableAttribute: { type: 'boolean' },
//             showButtonAttribute: { type: 'boolean' },
//             qqId: { type: 'string' }
//         }),
//     });
// }
// addFilter(
//     'blocks.registerBlockType',
//     'quick-questionnaire/set-sidebar-enable-attribute',
//     setSidebarEnableAttribute
// );
// // Add sidebar controls for the attributes
// const withSidebarEnable = createHigherOrderComponent((BlockEdit) => {
//     return (props) => {
//         if (props.name !== blockName) {
//             return <BlockEdit {...props} />;
//         }
//         const { attributes, setAttributes } = props;
//         const { enableAttribute, showButtonAttribute } = attributes;
//         // const [ meta, setMeta ] = useEntityProp('postType', 'quick-questionnaire', 'meta');
//         // let metaValue = null;
//         // try {
//         //     metaValue = JSON.parse(meta['_qq_enable_show_btn']) || {};
//         // } catch (ex) {
//         //     console.error(ex);
//         //     metaValue = {};
//         // }
//         return <>
//             <Fragment>
//                 <BlockEdit {...props} />
//                 <InspectorControls>
//                     <PanelBody title="Quick Questionnaire">
//                         <CheckboxControl label="Enable" checked={enableAttribute} onChange={(value) => {
//                             setAttributes({
//                                 enableAttribute: value,
//                                 showButtonAttribute: value ? showButtonAttribute : false,
//                                 qqId: value ? props.clientId : null
//                             });
//                         }} />
//                         {enableAttribute ? <CheckboxControl label="Show button" checked={showButtonAttribute} onChange={(value) => {
//                             //metaValue[qqId] = value;
//                             //setMeta({ ...meta, _qq_enable_show_btn: JSON.stringify(metaValue) });
//                             setAttributes({
//                                 showButtonAttribute: value
//                             });
//                         }} /> : null}
//                     </PanelBody>
//                 </InspectorControls>
//             </Fragment>
//         </>;
//     };
// }, 'withSidebarEnable');
// addFilter(
//     'editor.BlockEdit',
//     'quick-questionnaire/with-sidebar-enable',
//     withSidebarEnable
// );
// // Add className to block in editor.
// const withSidebarEnableProp = createHigherOrderComponent((BlockListBlock) => {
//     return (props) => {
//         if (props.name !== blockName) {
//             return <BlockListBlock {...props} />;
//         }
//         const { attributes } = props;
//         const { enableAttribute, showButtonAttribute } = attributes;
//         let classNames = [];
//         if (enableAttribute) classNames.push('quick-questionnaire-enabled');
//         if (showButtonAttribute) classNames.push('quick-questionnaire-show-button');
//         if (classNames.length > 0) {
//             return <BlockListBlock className={classNames.join(" ")} {...props} />;
//         } else {
//             return <BlockListBlock {...props} />;
//         }
//     };
// });
// addFilter(
//     'editor.BlockListBlock',
//     'quick-questionnaire/with-sidebar-enable-prop',
//     withSidebarEnableProp
// );
// // Add className to block in database
// const saveSidebarEnableAttribute = (extraProps, blockType, attributes) => {
//     if (blockType.name === blockName) {
//         const { enableAttribute, showButtonAttribute, qqId } = attributes;
//         let classNames = [];
//         if (extraProps.className) classNames.push(extraProps.className);
//         if (enableAttribute) classNames.push('quick-questionnaire-enabled');
//         //if (showButtonAttribute) classNames.push('quick-questionnaire-show-button');
//         if (enableAttribute) {
//             extraProps.className = classNames.join(" ");
//             extraProps['data-qq-id'] = qqId;
//             if (showButtonAttribute) {
//                 extraProps['data-qq-show-button'] = true;
//             }
//         }
//     }
//     return extraProps;
// };
// addFilter(
//     'blocks.getSaveContent.extraProps',
//     'quick-questionnaire/save-sidebar-enable-attribute',
//     saveSidebarEnableAttribute
// );

_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_5___default()(function () {
  //unregisterBlockType('core/verse');
  // Now unregister quick-questionnaire/list if we are not on quick-questionnaire post_type
  // AND define is not set.
  if (!window.qq_all_posts && window.qq_my_post_type !== 'quick-questionnaire') {
    (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.unregisterBlockType)('quick-questionnaire/list');
  }
});

function onAdd(arg) {
  const {
    attributes,
    setAttributes,
    type,
    setModalOpen
  } = arg;
  setModalOpen(true);
}

const defaultNewQuestionModal = {
  open: false,
  type: null,
  question: '',
  answers: ['']
};
const typeTitles = {
  'text': 'Case sensitive text',
  'itext': 'Case insensitive text',
  'radio': 'Radio',
  'checkbox': 'Checkbox',
  'reg': 'Regular expression'
}; // Store caret position before we open the modal. If we don't do this, we cannot retrieve it afterwards.

let range = null;
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.registerBlockType)('quick-questionnaire/list', {
  edit: function (props) {
    const {
      attributes,
      setAttributes
    } = props;
    const {
      showButton,
      ordered,
      qqId
    } = attributes;
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: "quick-questionnaire-enabled"
    });
    const [questionModal, setQuestionModal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({ ...defaultNewQuestionModal
    });
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
      setAttributes({
        qqId: qqId || Date.now()
      });
    }, []);

    function onModalClose() {
      //let content = attributes.content;
      const li = range.startContainer.parentElement; // als li.innerHTML leeg is, dan plaatsen we de nieuwe regel hier (men staat dan met de cursor op een nieuwe lege regel)
      // als die NIET leeg is, dan plaatsen we de nieuwe regel erna, dus eventueel ook ergens in de lijst zelf.

      const list = li.parentElement;
      const liIndex = Array.prototype.indexOf.call(list.children, li);
      const fragment = document.createDocumentFragment();
      fragment.appendChild(list.cloneNode(true));
      const newList = fragment.firstChild; // trim() is needed because by default a whitespace like character is added to a new list item

      if (!li.innerHTML.trim()) {
        newList.children[liIndex].innerHTML = questionModal.question + ' {' + questionModal.type + '{ ' + questionModal.answers.join(' | ') + ' }}';
      } else {
        let newLi = document.createElement('li');
        newLi.innerHTML = questionModal.question + ' {' + questionModal.type + '{ ' + questionModal.answers.join(' | ') + ' }}';

        if (liIndex + 1 === newList.children.length) {
          newList.appendChild(newLi);
        } else {
          newList.insertBefore(newLi, newList.children[liIndex + 1]);
        }
      }

      setAttributes({
        content: newList.innerHTML
      }); // if (content.endsWith('<li></li>')) content = content.substring(0, content.length - '<li></li>'.length);
      // console.log(content);
      // setAttributes({
      //     content: content + '<li>' + questionModal.question + ' {' + questionModal.type + '{ ' + questionModal.answers.join(' | ') + ' }}</li>'
      // });

      setQuestionModal({ ...defaultNewQuestionModal
      });
    }

    function openModal(type) {
      range = window.getSelection().getRangeAt(0);
      setQuestionModal({ ...defaultNewQuestionModal,
        type,
        open: true
      });
    }

    function closeModal() {
      setQuestionModal({ ...defaultNewQuestionModal
      });
    }

    function setAnswers(newAnswers) {
      //let newAnswers = [...questionModal.answers];
      //newAnswers[index] = newValue;
      setQuestionModal({ ...questionModal,
        answers: newAnswers
      });
    }

    function setQuestion(newValue) {
      setQuestionModal({ ...questionModal,
        question: newValue
      });
    }

    const modalWindow = questionModal.open ? (0,_modal__WEBPACK_IMPORTED_MODULE_6__.MyModal)({
      title: typeTitles[questionModal.type],
      answers: questionModal.answers,
      setAnswers,
      question: questionModal.question,
      setQuestion,
      closeModal,
      onModalClose,
      type: questionModal.type
    }) : null;
    const controls = [{
      title: typeTitles.text,
      //onClick: () => onAdd({ attributes, setAttributes, setModalOpen, type: 'text' })
      onClick: () => openModal('text')
    }, {
      title: typeTitles.itext,
      onClick: () => openModal('itext')
    }, {
      title: typeTitles.radio,
      onClick: () => openModal('radio')
    }, {
      title: typeTitles.checkbox,
      onClick: () => openModal('checkbox')
    }, {
      title: typeTitles.reg,
      onClick: () => openModal('reg')
    }];
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
      tagName: ordered ? "ol" : "ul",
      multiline: "li",
      value: attributes.content,
      onChange: content => setAttributes({
        content
      })
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: "Quick Questionnaire"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
      label: "Show button",
      checked: showButton,
      onChange: value => {
        setAttributes({
          showButton: value
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
      label: "Ordered",
      checked: ordered,
      onChange: value => {
        setAttributes({
          ordered: value
        });
      }
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarDropdownMenu, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"],
      label: "Add new question",
      controls: controls
    }))), modalWindow);
  },
  save: function (props) {
    const {
      attributes
    } = props;
    const {
      showButton,
      ordered,
      qqId
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save(); //const [ meta, setMeta ] = useEntityProp('postType', 'quick-questionnaire', 'meta');
    // Hier moet ik attributes.content parsen en opslaan in atributes.
    // Dit kan niet want save kan geen sideeffects hebben en moet een pure function zijn...
    //console.log(attributes.content);

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
      "data-qq-show-button": showButton || null,
      "data-qq-id": attributes.qqId,
      tagName: ordered ? "ol" : "ul",
      className: "quick-questionnaire-enabled",
      value: attributes.content
    }));
  }
});
}();
/******/ })()
;
//# sourceMappingURL=index.js.map