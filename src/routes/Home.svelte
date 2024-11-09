<script>
	import Card from './../lib/components/ui/card/card.svelte';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import {push, pop, replace} from 'svelte-spa-router'
  import { Badge } from "$lib/components/ui/badge";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Description } from '$lib/components/ui/card';
  let goal = ""; // 목표 이름 변수
  let goal_id; // 목표 ID 변수
  let goalArr = []; // 목표 배열 초기화

  // 목표 데이터를 가져오는 함수
  async function fetchGoalData() {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('id, goal')

    if (error) {
      console.error('Error fetching goal data:', error);
    } else if (goals && goals.length > 0) {
      goalArr = [...goals]; // 새 배열로 업데이트하여 반응형으로 변경
    }
  }

  // 컴포넌트가 마운트되었을 때 데이터 가져오기
  onMount(() => {
    // goal = "Grammar in Use"; // 기본 목표 이름 설정
    fetchGoalData(); // 데이터 가져오기
    gsap.to(".goal-list", {
      y: 50,
      duration: 2,
      stagger:1
    });

    gsap.to(".right_now", {
      duration: 0.8,
      rotation: 360,
      repeat:1
    });

  });

  let modal = false;

  const handlePopup = ()=>{
    modal = !modal;
  }
  
  let newGoal = {
    goal:"",
    totalcheckboxes:"",
    totalrounds:"",
    description:"",
    subtext:''
  }

  const handleSubmit = async (evt)=>{
    evt.preventDefault();
    const { error } = await supabase
        .from('goals')
        .upsert(newGoal);
    if(!error) {
      fetchGoalData(); // 데이터 가져오기
      handlePopup()
    }
  }

  const handleChange = (evt)=>{
    newGoal[evt.target.id] = evt.target.value;
  }

  const handleDelete = async(id)=>{
    const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id); // 'id' 값이 일치하는 행 삭제

  if (error) {
    console.error('Error deleting goal:', error);
  } else {
    // 목표 데이터를 다시 불러와 UI를 업데이트합니다.
    fetchGoalData();
  }
  }
  
</script>

<div class="container">
  <div class="header">
    <button id="todo" 
      on:click={() => gsap.from("#todo",{
        duration:1,
         rotation: 360,
      })}
     tabindex="0">
      할일을 하자
    </button>
    <div class="right_now">
      <i class="ri-star-fill"></i>
      지금당장해라
    </div >
    </div>
  <div class="goal-list">
    {#each goalArr as { id, goal }}
      <Card class="">
        <button  
        class="card-content">
          <Badge variant="outline">{id}</Badge>
          <p class="goal_text" on:click={()=>  push("/"+ id)}>{goal}</p>
            <i class="ri-delete-bin-line border px-1 rounded-lg" 
            on:click={()=> handleDelete(id)}></i>
        </button>
      </Card>
    {/each}
  </div>
  {#if modal}
    <div class="backdrop-blur-sm z-0 fixed h-dvh w-dvw top-0 left-0"></div>
    <form class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white w-[80%] p-2 border rounded-lg shadow-md  max-w-[400px] " on:submit={handleSubmit}>
      <i class="ri-close-circle-line"  on:click={handlePopup}></i>
      <p class="text-center ">목표 추가하기</p>
      <input class="border rounded-lg shadow-md w-full mb-2 px-2 py-1" type="text" name="goal" id="goal" placeholder="목표" on:change={handleChange} >
      <input  class="border rounded-lg shadow-md w-full mb-2 px-2 py-1"  type="text" name="totalrounds" id="totalrounds" placeholder="반복횟수" on:change={handleChange} >
      <input class="border rounded-lg shadow-md w-full mb-2 px-2 py-1"  type="text" name="totalcheckboxes" id="totalcheckboxes" placeholder="체크박스 갯수" on:change={handleChange} >
      <input class="border rounded-lg shadow-md w-full mb-2 px-2 py-1"  type="text" name="description" id="description" placeholder="설명" on:change={handleChange} >
      <input class="border rounded-lg shadow-md w-full mb-2 px-2 py-1"  type="text" name="subtext" id="subtext" placeholder="주제" on:change={handleChange} >
      <button type="submit" class="bg-yellow-200 border rounded-lg w-full py-1 px-2 hover:bg-yellow-50">추가</button>
    </form>
  {/if}
    <i class="ri-add-circle-line"  on:click={handlePopup}></i>
</div>

<style>

.header i{
  display: inline-block;
  color:red;
}

.right_now{
  color:red;
  font-size: 24px;
}
  .header{
    background-color: rgb(255, 242, 0);
    padding: 48px;
    text-align: center;
    font-size: 52px;
    word-break: keep-all;
  }

  .goal-list {
    display: flex;
    flex-direction: column;
    gap: 16px; /* 간격 조절 */
    margin:16px;
  }

  .card-content {
    padding: 16px; /* 카드 안의 패딩 */
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .goal_text {
    width: 100%;
  }
  .goal_text:hover{
   color:#34d399;
  }

  .container{
    position:relative;
    margin: 0;
    padding: 0;
  }

  .ri-add-circle-line{
    position:fixed;
    bottom: 2rem;
    right:2rem;
    font-size: 32px;
    cursor: pointer;
  }

  .ri-close-circle-line{
    font-size: 24px;
    cursor: pointer;
    float: right;
  }

</style>