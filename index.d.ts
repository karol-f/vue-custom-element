// Type definitions for vue-custom-element 1.2.1
// Definitions by: Isaac Lyman http://isaaclyman.com

import Vue from "vue"
import { ComponentOptions, PluginFunction } from 'vue'

declare class VueCustomElement {
    static install: PluginFunction<never>;
}

declare namespace VueCustomElement {
    interface options {
        constructorCallback: () => void;
        connectedCallback: () => void;
        disconnectedCallback: () => void;
        attributeChangedCallback: (name: string, oldValue: any, value: any) => void;
        destroyTimeout: number;
        props: ComponentOptions<Vue>['props'];
        shadow: boolean;
        shadowCss: string;
    }
}

declare module "vue" {
    export function customElement(tag: string, componentDefinition: ComponentOptions<Vue>, options?: VueCustomElement.options): void;
    export function customElement(tag: string, asyncComponentDefinition: () => Promise<ComponentOptions<Vue>>, options?: VueCustomElement.options): void;
}

export = VueCustomElement