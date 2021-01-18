// Type definitions for vue-custom-element 1.2.1
// Definitions by: Isaac Lyman http://isaaclyman.com

import Vue from 'vue'
import { ComponentOptions, PluginFunction } from 'vue'

declare class VueCustomElement {
    static install: PluginFunction<never>;
}

declare namespace VueCustomElement {
    interface options {
        constructorCallback?: () => void;
        connectedCallback?: () => void;
        disconnectedCallback?: () => void;
        attributeChangedCallback?: (name: string, oldValue: any, value: any) => void;
        beforeCreateVueInstance?: (rootElement: ComponentOptions<Vue>) => ComponentOptions<Vue> | Promise<ComponentOptions<Vue>>;
        vueInstanceCreatedCallback?: () => void;
        destroyTimeout?: number;
        props?: ComponentOptions<Vue>['props'];
        shadow?: boolean;
        shadowCss?: string;
    }
}

declare module 'vue/types/vue' {
    export interface VueConstructor {
        customElement(tag: string, componentDefinition: ComponentOptions<Vue>, options?: VueCustomElement.options): void;
        customElement(tag: string, singleFileComponent: VueConstructor<Vue>, options?: VueCustomElement.options): void;
        customElement(tag: string, asyncComponentDefinition: () => Promise<ComponentOptions<Vue>>, options?: VueCustomElement.options): void;
    }

}
export default VueCustomElement
