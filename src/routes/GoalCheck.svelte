<script>
  import * as Card from "$lib/components/ui/card";
  import { supabase } from '$lib/supabaseClient';
  import { push,pop } from "svelte-spa-router";

  export let params; // URL 파라미터

  // 총 회독 수와 총 체크박스 수
  export let totalRounds;
  export let totalCheckBoxes;

  // 목표 정보를 저장할 변수
  let goal = {
    id: null,
    name: '',
    totalCheckBoxes: 0,
    totalRounds: 0,
    description: '',
    subtext:''
  };

  // 체크박스 진행 상태를 저장할 배열 초기화
  let progress = [];

  // 데이터 로드 상태
  let loading = true;

  // 목표 데이터 및 체크박스 상태를 가져오는 함수
  async function fetchGoalData() {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('id, goal, totalcheckboxes, totalrounds, description, subtext')
      .eq('id', params.goal); // params에서 목표 이름 가져오기

    if (error) {
      console.error('Error fetching goal data:', error);
    } else if (goals && goals.length > 0) {
      goal.id = goals[0].id; // 목표 ID 설정
      goal.name = goals[0].goal; // 목표 이름 설정
      goal.totalCheckBoxes = goals[0].totalcheckboxes; // 총 체크박스 수 설정
      goal.totalRounds = goals[0].totalrounds; // 총 회독 수 설정
      goal.description = goals[0].description; // 설명 설정
      goal.subtext = goals[0].subtext; // 설명 설정

      // 진행 상태 배열 초기화
      progress = Array(goal.totalRounds).fill(0).map(() => Array(goal.totalCheckBoxes).fill(false));

      // 목표 ID로 체크박스 진행 상태 가져오기
      await fetchProgressData();
    }
    
    // 데이터 로드 완료
    loading = false;
  }

  // 목표 ID에 따라 체크박스 진행 상태를 가져오는 함수
  async function fetchProgressData() {
    const { data: goaltracker, error } = await supabase
      .from('goaltracker')
      .select('*')
      .eq('goal_id', goal.id);

    if (error) {
      console.error('Error fetching progress data:', error);
    } else if (goaltracker) {
      // 진행 상태 배열에 데이터 설정
      goaltracker.forEach(({ round, unit, isChecked }) => {
        progress[round - 1][unit - 1] = isChecked; // 0 기반 인덱스 맞추기
      });
    }
  }

  // 체크박스 상태를 Supabase에 저장하는 함수
  async function toggleCheckbox(round, index) {
    // 체크박스 상태 토글
    progress[round][index] = !progress[round][index];

    if (progress[round][index]) {
      // 체크된 경우, Supabase에 상태 업데이트
      const { error } = await supabase
        .from('goaltracker')
        .upsert({ 
          goal_id: goal.id, // 목표 ID
          round: round + 1, 
          unit: index + 1, 
          isChecked: true 
        });

      if (error) {
        console.error('Error updating data:', error);
      } else {
        console.log(`Checked round ${round + 1}, unit ${index + 1}`);
      }
    } else {
      // 체크 해제된 경우, Supabase에서 삭제
      const { error } = await supabase
        .from('goaltracker')
        .delete()
        .match({ 
          goal_id: goal.id, 
          round: round + 1, 
          unit: index + 1 
        });

      if (error) {
        console.error('Error deleting data:', error);
      } else {
        console.log(`Unchecked round ${round + 1}, unit ${index + 1}`);
      }
    }
  }

  // 컴포넌트가 마운트될 때 데이터 가져오기
  fetchGoalData();
</script>

<main class="main">
  {#if loading}
    <p class="loading">Loading...</p> <!-- 데이터 로드 중 표시할 내용 -->
  {:else}

  <h1 class="title">
    <button on:click={()=> pop()} aria-label="back" class="back">
      <i class="ri-arrow-left-s-line"></i>
    </button>
    
    <div class="flex flex-col justify-end items-end">
      <span class="">{goal.name}</span>
      <span class="text-base">{goal.totalRounds} {goal.subtext}</span>
    </div>
  </h1>
    <div class="flex flex-col gap-2 px-4 mb-10">
      {#each Array(goal.totalRounds) as _, round}
        <Card.Root class="custom-card">
          <Card.Header>
            <Card.Title>{round + 1}{goal.subtext}</Card.Title>
            <Card.Description>{goal.description}</Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="checkboxes">
              {#each Array(goal.totalCheckBoxes) as _, index}
                <button
                  class="custom-checkbox {progress[round][index] ? 'checked' : ''}"
                  style="background-color: {progress[round][index] ? '#34d399' : 'white'}; color: {progress[round][index] ? 'white' : 'gray'};"
                  on:click={() => toggleCheckbox(round, index)}
                >
                  {index + 1}
                </button>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>  
  {/if}
</main>

<style>

  .back{
    position: absolute;
    top:24px;
    left:12px;
    font-size: 32px;
  }
  
  .main {
    font-family: DungGeunMo; 
    position: relative;
  }
  
  .loading{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
  }

  .title {
    position: relative;
    display: flex;
    justify-content: end;
    align-items: end;
    font-size: x-large;
    padding: 24px;
  }

  .checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .custom-checkbox {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border: 1px solid gray;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .custom-card:last-child{
    margin-bottom: 42px;
  }
</style>