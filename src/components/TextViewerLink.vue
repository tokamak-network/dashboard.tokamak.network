<template>
  <div class="text-viewer-link">
    <hr class="divider" :style="[withDivider ? {} : {'visibility': 'hidden'}]">
    <div class="row">
      <div class="title">{{ title }}</div>
      <div class="content">
        <a
          class="link"
          target="_blank"
          rel="noopener noreferrer"
          :href="href"
        >{{ content }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { getConfig } from '../../config.js';

export default {
  props: {
    title: {
      type: String,
    },
    content: {
    },
    type: {
      // transactionHash or address
    },
    withDivider: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    href () {
      if (this.type === 'transactionHash') {
        return getConfig().prefixTransactionHash + this.content;
      } else if (this.type === 'address') {
        return getConfig().prefixAddress + this.content;
      } else {
        return this.content;
      }
    },
  },
};
</script>

<style scoped>
.text-viewer-link {
  margin-bottom: 6px;
}

.row {
  display: flex;
  flex-direction: row;
}

.title {
  padding-left: 16px;
  margin-right: 24px;
  font-family: Roboto;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.content {
  display: inline-block;
  flex: 1;
  text-align: right;
  padding-right: 16px;
  font-family: Roboto;
  font-size: 10px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
  word-break: break-word;
}

.link {
/* font-weight: bolder; */
  text-decoration: underline;
  color: black;
}

.divider {
  height: 0;
  border: solid 0.5px #dce2e5;
  margin: 0px;
  padding: 0px;
  margin-bottom: 8px;
}

.hidden {
  visibility: hidden;
}
</style>
