/**
 * See for source:
 * https://github.com/MarieComet/core-block-custom-attributes
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl } from '@wordpress/components';

const blockName = 'core/list';

function setSidebarEnableAttribute(settings, name) {
    if (name !== blockName) return settings;
    return Object.assign({}, settings, {
        attributes: Object.assign({}, settings.attributes, {
            enableAttribute: { type: 'boolean' }
        }),
    });
}

addFilter(
    'blocks.registerBlockType',
    'quick-questionnaire/set-sidebar-enable-attribute',
    setSidebarEnableAttribute
);


const withSidebarEnable = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        if (props.name !== blockName) {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const { enableAttribute } = attributes;

        return <>
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                <PanelBody title="Quick Questionnaire">
                    <CheckboxControl label="Enable" checked={enableAttribute} onChange={(value) => {
                        setAttributes({
                            enableAttribute: value
                        });
                    }} />
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

const withSidebarEnableProp = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        if (props.name !== blockName) {
            return <BlockListBlock { ...props } />;
        }
        const { attributes } = props;
        const { enableAttribute } = attributes;
        if (enableAttribute) {
            return <BlockListBlock className="quick-questionnaire-enabled" { ...props } />;
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

const saveSidebarEnableAttribute = (extraProps, blockType, attributes) => {
    if (blockType.name === blockName) {
        const { enableAttribute } = attributes;
        if (enableAttribute) {
            extraProps.className = (extraProps.className ? (extraProps.className + ' ') : '') + 'quick-questionnaire-enabled';
        }
    }
    return extraProps;
};

addFilter(
    'blocks.getSaveContent.extraProps',
    'quick-questionnaire/save-sidebar-enable-attribute',
    saveSidebarEnableAttribute
);