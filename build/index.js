!function(){"use strict";var e={};function t(){return t=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},t.apply(this,arguments)}e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,{a:n}),n},e.d=function(t,n){for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},e.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)};var n=window.wp.element,o=window.wp.blockEditor,r=window.wp.components,i=window.wp.blocks,a=window.wp.domReady;e.n(a)()((function(){window.qq_all_posts||"quick-questionnaire"===window.qq_my_post_type||(0,i.unregisterBlockType)("quick-questionnaire/list")})),(0,i.registerBlockType)("quick-questionnaire/list",{edit:function(e){const{attributes:i,setAttributes:a}=e,{showButton:l,ordered:c}=i,u=(0,o.useBlockProps)({className:"quick-questionnaire-enabled"});return(0,n.createElement)(n.Fragment,null,(0,n.createElement)(o.RichText,t({},u,{tagName:c?"ol":"ul",multiline:"li",value:i.content,onChange:e=>a({content:e})})),(0,n.createElement)(o.InspectorControls,null,(0,n.createElement)(r.PanelBody,{title:"Quick Questionnaire"},(0,n.createElement)(r.CheckboxControl,{label:"Show button",checked:l,onChange:e=>{a({showButton:e})}}),(0,n.createElement)(r.CheckboxControl,{label:"Ordered",checked:c,onChange:e=>{a({ordered:e})}}))))},save:function(e){const{attributes:r}=e,{showButton:i,ordered:a}=r,l=o.useBlockProps.save();return(0,n.createElement)(o.RichText.Content,t({},l,{"data-qq-show-button":i||null,tagName:a?"ol":"ul",className:"quick-questionnaire-enabled",value:r.content}))}})}();