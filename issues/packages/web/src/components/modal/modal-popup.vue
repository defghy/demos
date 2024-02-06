<template>
    <transition name="fade">
        <div class="popup-wrapper" v-show="visible" :class="{ showMask }">
            <div class="mask" @click="clickMask" v-show="showMask"></div>
            <transition :name="animation">
                <component
                    v-show="visible"
                    ref="ctnRef"
                    class="comp-wrapper"
                    v-bind="innerProps"
                    :is="compName"
                    :isShow="visible"
                    @close="close"
                />
            </transition>
        </div>
    </transition>
</template>

<script lang="js">
export default {
    components: {},
    props: {
        compName: { type: String },
        showMask: { type: Boolean, default: true },
        closeOnClickMask: { type: Boolean, default: true },
        closeOnRouterChange: { type: Boolean, default: true },
        innerProps: Object,
        animation: { default: 'fade' }, // slideup |
        onClose: { type: Function, default: null }
    },
    data() {
        return {
            startClose: false,
            visible: false,
        };
    },
    watch: {
        $route() {
            if (this.closeOnRouterChange) {
                this.close({ immediately: true });
            }
        },
    },
    mounted() {
        this.visible = true;
    },
    methods: {
        close({ immediately } = {}) {
            if (this.startClose) {
                return;
            }
            this.startClose = true;
            this.visible = false;

            if (typeof this.onClose === 'function') {
                this.onClose();
            }

            if (immediately) {
                this.innerAfterClose();
            } else {
                setTimeout(this.innerAfterClose, 500);
            }
        },
        innerAfterClose() {
            if (this.$el && this.$el.parentNode) {
                this.$el.parentNode.removeChild(this.$el);
            }

            this.$destroy();
        },
        clickMask() {
            if (this.closeOnClickMask && this.showMask) {
                this.close();
            }
        },
    },
};
</script>

<style lang="less" scoped>
.popup-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    pointer-events: none;

    &.showMask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: hidden;
    }
    .mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.24);
        -webkit-backdrop-filter: blur(4px);
        backdrop-filter: blur(4px);
        pointer-events: auto;
    }
    .comp-wrapper {
        pointer-events: auto;
    }
}

@keyframes slideUp {
    from {
        transform: translate3d(0, 100%, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}
.slideup {
    &-enter {
        transform: translate3d(0, 100%, 0);
    }
    &-enter-active {
        transition: transform 250ms;
    }
    &-leave-active {
        transform: translate3d(0, 100%, 0);
        transition: transform 250ms;
    }
}
.slidedown {
    &-enter {
        transform: translate3d(0, -100%, 0);
    }
    &-enter-active {
        transition: transform 250ms;
    }
    &-leave-active {
        transform: translate3d(0, -100%, 0);
        transition: transform 250ms;
    }
}
.slideleft {
    &-enter {
        transform: translate3d(100%, 0, 0);
    }
    &-enter-active {
        transition: transform 250ms;
    }
    &-leave-active {
        transform: translate3d(100%, 0, 0);
        transition: transform 250ms;
    }
}

.fade {
    &-enter {
        opacity: 0;
    }
    &-enter-active {
        transition: opacity 400ms;
    }
    &-leave-active {
        transition: opacity 400ms;
        opacity: 0;
    }
}
</style>
