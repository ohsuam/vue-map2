<template>
  <div id="app">
    <!-- 헤더 -->
    <subHeader></subHeader>

    <!-- 지도화면 -->
    <subMapApi></subMapApi>

    <!-- 댓글화면 -->
    <div id="comment" class="item2">
      <TodoInput></TodoInput>
      <TodoList></TodoList>
      <TodoFooter></TodoFooter>
    </div> 
  </div>
</template>


<script>
import subHeader from './components/subHeader.vue';
import subMapApi from './components/subMapApi.vue';
import TodoInput from './components/TodoInput.vue';
import TodoList from './components/TodoList.vue';
import TodoFooter from './components/TodoFooter.vue';


export default {
  components : {
    subHeader,
    subMapApi,
    TodoInput,
    TodoList,
    TodoFooter,
  }
}
</script>



<style>
  body {
    background-color : #b0daea;
  }

  #app{
    text-align : center;
  }

  @keyframes text-in {
    0% {
      transform: translate(0, -20px);
      opacity: 0;
    }
  }

  .item2 {
    display: inline-block;
    min-width: 0.3em;
    animation: text-in .8s cubic-bezier(0.22, 0.15, 0.55, 1.43) 0s backwards;
    width : 100%;
    position: flex;
  }

  select {
    width: 80px;
    padding: .5em .5em;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  #subName {
    width: 80px;
    padding: .5em .5em;
  }
</style>