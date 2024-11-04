<script>
	import Card from './../lib/components/ui/card/card.svelte';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import {push, pop, replace} from 'svelte-spa-router'
  import { Badge } from "$lib/components/ui/badge";
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

  
</script>
<div>
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
      <Card>
        <button  
        on:click={()=>  push("/"+ id)}
        class="card-content">
          <Badge variant="outline">{id}</Badge>
          <p>{goal}</p>
        </button>
      </Card>
    {/each}
  </div>
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

  .card-content:hover{
    background-color: rgb(255, 242, 0);
    border-radius: 8px;
  }

</style>