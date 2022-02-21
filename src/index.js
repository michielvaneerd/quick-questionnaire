/**
 * See for source:
 * https://github.com/MarieComet/core-block-custom-attributes
 * https://developer.wordpress.org/block-editor/how-to-guides/plugin-sidebar-0/
 * https://awhitepixel.com/blog/how-to-add-post-meta-fields-to-gutenberg-document-sidebar/
 * https://wordpress.org/support/topic/how-to-create-a-gutenberg-block-with-your-own-list-inside-which-there-will-be-o/ ==> eigen list maken
 */

//import { addFilter } from '@wordpress/hooks';
//import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, useBlockProps, RichText, BlockControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, ToolbarDropdownMenu, Button, Modal, ToolbarGroup, TextControl } from '@wordpress/components';
//import { useEntityProp } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';
import { registerBlockType, unregisterBlockType } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';
import { create } from '@wordpress/icons';
import { MyModal } from './modal';

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

domReady(function () {
    //unregisterBlockType('core/verse');
    // Now unregister quick-questionnaire/list if we are not on quick-questionnaire post_type
    // AND define is not set.
    if (!window.qq_all_posts && window.qq_my_post_type !== 'quick-questionnaire') {
        unregisterBlockType('quick-questionnaire/list');
    }
});

function onAdd(arg) {
    const { attributes, setAttributes, type, setModalOpen } = arg;
    setModalOpen(true);
    // setAttributes({
    //     content: attributes.content + '<li>New item {' + type + '{ Answer }}</li>'
    // });
}

const defaultNewQuestionModal = {
    open: false,
    type: null,
    question: '',
    answers: []
};

registerBlockType('quick-questionnaire/list', {
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { showButton, ordered, qqId } = attributes;
        const blockProps = useBlockProps({
            className: "quick-questionnaire-enabled"
        });
        // const [isModalOpen, setModalOpen] = useState(false);
        // const [ type, setType ] = useState(null);
        const [questionModal, setQuestionModal] = useState({ ...defaultNewQuestionModal });
        //const [question, setQuestion] = useState('');
        //const [answers, setAnswers] = useState([]);

        useEffect(() => {
            setAttributes({
                qqId: qqId || Date.now()
            });
        }, []);

        function onModalClose() {
            setAttributes({
                content: attributes.content + '<li>' + questionModal.question + ' {' + questionModal.type + '{ ' + questionModal.answers.join(' | ') + ' }}</li>'
            });
            setQuestionModal({ ...defaultNewQuestionModal });
        }

        function openModal(type) {
            setQuestionModal({
                ...defaultNewQuestionModal,
                type,
                open: true
            });
        }

        function closeModal() {
            setQuestionModal({
                ...defaultNewQuestionModal
            });
        }

        function setAnswers(newAnswers) {
            //let newAnswers = [...questionModal.answers];
            //newAnswers[index] = newValue;
            setQuestionModal({ ...questionModal, answers: newAnswers });
        }

        function setQuestion(newValue) {
            setQuestionModal({
                ...questionModal, question: newValue
            });
        }

        const modalWindow = questionModal.open
            ?
            MyModal({ title: "TEXT", answers: questionModal.answers, setAnswers, question: questionModal.question, setQuestion, closeModal, onModalClose, type: questionModal.type })
            :
            null;

        const controls = [
            {
                title: 'Case sensitive text',
                //onClick: () => onAdd({ attributes, setAttributes, setModalOpen, type: 'text' })
                onClick: () => openModal('text')
            },
            {
                title: 'Case insensitive text',
                onClick: () => openModal('itext')
            },
            {
                title: 'Radio',
                onClick: () => openModal('radio')
            },
            {
                title: 'Checkbox',
                onClick: () => openModal('checkbox')
            },
            {
                title: 'Regular expression',
                onClick: () => openModal('reg')
            },
        ];

        return <>
            <RichText
                {...blockProps}
                tagName={ordered ? "ol" : "ul"}
                multiline="li"
                value={attributes.content}
                onChange={(content) => setAttributes({ content })}
            />
            <InspectorControls>
                <PanelBody title="Quick Questionnaire">
                    <CheckboxControl label="Show button" checked={showButton} onChange={(value) => {
                        setAttributes({
                            showButton: value
                        });
                    }} />
                    <CheckboxControl label="Ordered" checked={ordered} onChange={(value) => {
                        setAttributes({
                            ordered: value
                        });
                    }} />
                </PanelBody>
            </InspectorControls>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarDropdownMenu icon={create} label="Add new question" controls={controls} />
                </ToolbarGroup>
            </BlockControls>
            {modalWindow}
        </>;
    },
    save: function (props) {
        const { attributes } = props;
        const { showButton, ordered, qqId } = attributes;
        const blockProps = useBlockProps.save();

        //const [ meta, setMeta ] = useEntityProp('postType', 'quick-questionnaire', 'meta');

        // Hier moet ik attributes.content parsen en opslaan in atributes.
        // Dit kan niet want save kan geen sideeffects hebben en moet een pure function zijn...
        //console.log(attributes.content);

        return <RichText.Content {...blockProps}
            data-qq-show-button={showButton || null}
            data-qq-id={attributes.qqId}
            tagName={ordered ? "ol" : "ul"}
            className="quick-questionnaire-enabled"
            value={attributes.content} />;
    },
});
