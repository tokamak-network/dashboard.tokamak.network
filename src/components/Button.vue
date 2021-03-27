<template>
  <button :class="{
            primary: type === 'primary',
            'primary-typeB': type === 'primary-typeB',
            secondary: type === 'secondary',
            vote: type === 'vote',
            voteV2: type === 'voteV2',
            hide: type === 'hide',

            'primary-running': type === 'primary' && status === 'running',
            'primary-running-typeB': type === 'primary-typeB' && status === 'running',
            'secondary-running': type === 'secondary' && status === 'running',
            'vote-running': type === 'vote' && status === 'running',
            'voteV2-running': type === 'voteV2' && status === 'running',

            'primary-disabled': type === 'primary' && status === 'disabled',
            'primary-disabled-typeB': type === 'primary-typeB' && status === 'disabled',
            'secondary-disabled': type === 'secondary' && status === 'disabled',
            'vote-disabled': type === 'vote' && status === 'disabled',
            'voteV2-disabled': type === 'voteV2' && status === 'disabled',

            'running': status === 'running',
          }"
          :style="{ width: width }"
          :disabled="status === 'disabled'"
          @click="click"
  >
    <div v-if="status === 'running'"
         class="loader" :class="{ 'loader-vote': type === 'vote' }"
    />
    <div v-else>{{ name }}</div>
  </button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
      default: '',
    },
    status: {
      type: String,
      default: '',
      validator: (value) => {
        return [
          '',
          'running',
          'disabled',
        ].indexOf(value) !== -1;
      },
    },
    type: {
      type: String,
      default: '',
      validator: (value) => {
        return [
          'primary',
          'secondary',
          'vote',
          'primary-typeB',
          'hide',
          'voteV2',
        ].indexOf(value) !== -1;
      },
    },
    width: {
      type: String,
      default: '100%',
    },
  },
  methods: {
    click () {
      if (this.status !== 'running')
        this.$emit('on-clicked');
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  width: 100%;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: none;
  border-radius: 4px;
  outline: none;

  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
}
button:hover {
  cursor: pointer;
}

.primary, .primary-running {
  box-shadow: 0 3px 8px 0 rgba(49, 127, 203, 0.25);
  background-image: linear-gradient(to bottom, #1f8efa, #2a72e5);

  color: #ffffff;
}
.primary:hover {
  box-shadow: 0 1px 4px 0 rgba(49, 127, 203, 0.25);
}
.primary:active {
  background: #2a72e5;
  box-shadow: 0 1px 4px 0 rgba(49, 127, 203, 0.25);
}
.primary:disabled {
  background: #e9edf1;
  cursor: not-allowed;
  box-shadow: none;

  color: #86929d
}
.primary-running:hover {
  box-shadow: 0 3px 8px 0 rgba(49, 127, 203, 0.25);
  background-image: linear-gradient(to bottom, #1f8efa, #2a72e5);

  color: #ffffff;
}

.primary-typeB, .primary-running-typeB {
  box-shadow: 0 3px 8px 0 rgba(247, 152, 28, 0.15);
  background-image: linear-gradient(to bottom, #f7981c, #ff7800);

  color: #ffffff;
}
.primary-typeB:hover {
  box-shadow: 0 1px 4px 0 rgba(247, 152, 28, 0.15);
}
.primary-typeB:active {
  background: #ff7800;
  box-shadow: 0 1px 4px 0 rgba(247, 152, 28, 0.15);
}
.primary-typeB:disabled {
  background: #e9edf1;
  cursor: not-allowed;
  box-shadow: none;

  color: #86929d
}
.primary-running-typeB:hover {
  box-shadow: 0 3px 8px 0 rgba(247, 152, 28, 0.15);
  background-image: linear-gradient(to bottom, #f7981c, #ff7800);

  color: #ffffff;
}

.secondary, .secondary-running {
  background: #257eee;

  color: #ffffff;
}
.secondary:hover {
  background: #2a72e5;
}
.secondary:active {
  background: #2a72e5;
}
.secondary:disabled {
  background: #e9edf1;
  cursor: not-allowed;

  color: #86929d
}
.secondary-running:hover {
  background: #257eee;

  color: #ffffff;
}

.vote, .vote-running {
  border: solid 1px #a9c6f4;
  background: #ffffff;

  color: #a9c6f4;
}
.vote:hover {
  border: solid 1px #2a72e5;
  color: #2a72e5;
}
.vote:active {
  border: solid 1px #2a72e5;
  background: #f1f6fd;
}
.vote:disabled {
  border: solid 1px #dfe4ee;
  cursor: not-allowed;

  color: #86929d
}
.vote-running:hover {
  border: solid 1px #a9c6f4;
  background: #ffffff;

  color: #a9c6f4;
}

.voteV2, .voteV2-running {
  height: 42px;

  background: #257eee;

  color: #ffffff;
}
.voteV2:hover {
  background: #2a72e5;
}
.voteV2:active {
  background: #2a72e5;
}
.voteV2:disabled {
  background: #d9e7f9;
  cursor: not-allowed;
}
.voteV2-running:hover {
  height: 42px;

  background: #257eee;

  color: #ffffff;
}

.hide {
  border: solid 1px #dfe4ee;
  background-color: #ffffff;

  color: #3e495c;
}
.hide:hover {
  border: solid 1px #3e495c;
}

.loader {
  width: 18px;
  height: 18px;

  border: 2px solid #82b3f4;
  border-top: 2px solid #ffffff;
  border-radius: 50%;

  animation: spin 2s linear infinite;
}
.loader-vote {
  border: 2px solid #c0d8fc;
  border-top: 2px solid #2770e5;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.running {
  &:hover {
    cursor: not-allowed;
  }
}
</style>
