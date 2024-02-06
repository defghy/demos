import Vue from 'vue';

import Dialog from './modal-popup.vue';

let store, router, i18n, apolloProvider;

const modal = function(cfg) {
    const config = Object.assign({}, cfg);
    // container自动识别容器
    const { content } = config;
    delete config.content;

    let Component = Object.assign({}, Dialog, {
        store,
        router,
        i18n,
        apolloProvider,
    });
    Object.assign(Component.components, {
        innerMain: content,
    });
    Component = Vue.extend(Component);

    const { props, ...prosData } = config;
    const instance = new Component({
        propsData: {
            innerProps: props,
            compName: 'innerMain',
            ...prosData,
            ...(content.ksDialogConfig || {}),
        },
    });

    document.body.appendChild(instance.$mount().$el);

    return instance;
};

modal.setProvider = function(data) {
    if (data.store) {
        store = data.store;
    }
    if (data.router) {
        router = data.router;
    }
    if (data.i18n) {
        i18n = data.i18n;
    }
    if (data.apolloProvider) {
        apolloProvider = data.apolloProvider;
    }
};

export default modal;
