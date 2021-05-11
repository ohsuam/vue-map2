<template>
  <div class = "clearAllContainer">
      <span @click = "clearTodo" class = "clearAllBtn">
        Clear All
      </span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  methods : {
    ...mapMutations({
      clearTodo: 'clearLocal'
    })
    // clearTodo () {
    //   //this.$emit('clearAll');
    //   this.$store.commit('clearLocal');
    // }
  }
}
</script>

<style scoped>
  .clearAllContainer {
    width : 8.5rem;
    height : 50px;
    line-height : 50px;
    background-color : white;
    border-radius : 5px;
    margin : 0 auto;
  }
  .clearAllBtn {
    color : #e20303;
    display : block;
  }
</style>