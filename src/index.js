/**
 * See for source:
 * https://github.com/MarieComet/core-block-custom-attributes
 * https://developer.wordpress.org/block-editor/how-to-guides/plugin-sidebar-0/
 * https://awhitepixel.com/blog/how-to-add-post-meta-fields-to-gutenberg-document-sidebar/
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';

const blockName = 'core/list';

// Enable some attributes
function setSidebarEnableAttribute(settings, name) {
    if (name !== blockName) return settings;
    return Object.assign({}, settings, {
        attributes: Object.assign({}, settings.attributes, {
            enableAttribute: { type: 'boolean' },
            showButtonAttribute: { type: 'boolean' },
            qqId: { type: 'string' }
        }),
    });
}
addFilter(
    'blocks.registerBlockType',
    'quick-questionnaire/set-sidebar-enable-attribute',
    setSidebarEnableAttribute
);

// Add sidebar controls for the attributes
const withSidebarEnable = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        if (props.name !== blockName) {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const { enableAttribute, showButtonAttribute } = attributes;

        // const [ meta, setMeta ] = useEntityProp('postType', 'quick-questionnaire', 'meta');
        // let metaValue = null;
        // try {
        //     metaValue = JSON.parse(meta['_qq_enable_show_btn']) || {};
        // } catch (ex) {
        //     console.error(ex);
        //     metaValue = {};
        // }

        return <>
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                <PanelBody title="Quick Questionnaire">
                    <CheckboxControl label="Enable" checked={enableAttribute} onChange={(value) => {
                        setAttributes({
                            enableAttribute: value,
                            showButtonAttribute: value ? showButtonAttribute : false,
                            qqId: value ? props.clientId : null
                        });
                    }} />
                    {enableAttribute ? <CheckboxControl label="Show button" checked={showButtonAttribute} onChange={(value) => {
                        //metaValue[qqId] = value;
                        //setMeta({ ...meta, _qq_enable_show_btn: JSON.stringify(metaValue) });
                        setAttributes({
                            showButtonAttribute: value
                        });
                    }} /> : null}
                </PanelBody>
                </InspectorControls>
            </Fragment>
        </>;

    };
}, 'withSidebarEnable');
addFilter(
    'editor.BlockEdit',
    'quick-questionnaire/with-sidebar-enable',
    withSidebarEnable
);

// Add className to block in editor.
const withSidebarEnableProp = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        if (props.name !== blockName) {
            return <BlockListBlock { ...props } />;
        }
        const { attributes } = props;
        const { enableAttribute, showButtonAttribute } = attributes;
        let classNames = [];
        if (enableAttribute) classNames.push('quick-questionnaire-enabled');
        if (showButtonAttribute) classNames.push('quick-questionnaire-show-button');
        if (classNames.length > 0) {
            return <BlockListBlock className={classNames.join(" ")} { ...props } />;
        } else {
            return <BlockListBlock { ...props } />;
        }
    };
});
addFilter(
    'editor.BlockListBlock',
    'quick-questionnaire/with-sidebar-enable-prop',
    withSidebarEnableProp
);

// Add className to block in database
const saveSidebarEnableAttribute = (extraProps, blockType, attributes) => {
    if (blockType.name === blockName) {
        const { enableAttribute, showButtonAttribute, qqId } = attributes;
        let classNames = [];
        if (extraProps.className) classNames.push(extraProps.className);
        if (enableAttribute) classNames.push('quick-questionnaire-enabled');
        //if (showButtonAttribute) classNames.push('quick-questionnaire-show-button');
        if (enableAttribute) {
            extraProps.className = classNames.join(" ");
            extraProps['data-qq-id'] = qqId;
            if (showButtonAttribute) {
                extraProps['data-qq-show-button'] = true;
            }
        }
    }
    return extraProps;
};
addFilter(
    'blocks.getSaveContent.extraProps',
    'quick-questionnaire/save-sidebar-enable-attribute',
    saveSidebarEnableAttribute
);

// const saveChangedContent = (element, blockType, attributes) => {
//     if (blockType.name === blockName) {
//         console.log(element);
//         console.log(attributes.values);
//     }
//     return element;
// };

// addFilter(
//     'blocks.getSaveElement',
//     'quick-questionnaire/save-changed-content',
//     saveChangedContent
// );