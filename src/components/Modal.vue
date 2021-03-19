<template>
  <transition name="modal">
    <div class="modal-mask">
      <!-- @mousedown="$emit('on-closed')" -->
      <div class="modal-wrapper">
        <div class="modal-container"
             :class="{ mobile: mobile }"
             :style="{ width: width }"
             @mousedown.stop
        >
          <div class="modal-body">
            <slot name="body" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '100%',
      required: true,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.mobile {
  width: 100%;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
