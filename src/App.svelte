<script>
  import * as Card from "$lib/components/ui/card";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { supabase } from '$lib/supabaseClient';

  const goal = "Grammar in Use";  
  const totalCheckBoxes = 113;
  const totalRounds = 10;

  // Colors for each round
  const roundColors = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#fb7185", "#7dd3fc", "#d946ef", "#f87171", "#34d399"];

  // Initialize progress array
  let progress = Array(totalRounds).fill(0).map(() => Array(totalCheckBoxes).fill(false));

  // goal_id to be fetched from Supabase
  let goal_id;

  // Fetch goal_id from the goals table
  async function fetchGoalData() {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('id')
      .eq('goal', goal);

    if (error) {
      console.error('Error fetching goal data:', error);
    } else if (goals && goals.length > 0) {
      goal_id = goals[0].id;

      // Once goal_id is set, fetch progress data
      await fetchProgressData();
    }
  }

  // Fetch progress data using the fetched goal_id
  async function fetchProgressData() {
    let { data: goaltracker, error } = await supabase
      .from('goaltracker')
      .select('*')
      .eq('goal_id', goal_id);

    if (error) {
      console.error('Error fetching progress data:', error);
    } else if (goaltracker) {
      // Populate progress array with data from Supabase
      goaltracker.forEach(({ round, unit, isChecked }) => {
        progress[round - 1][unit - 1] = isChecked;
      });
    }
  }

  // Save the checkbox state in Supabase
  async function toggleCheckbox(round, index) {
    // Toggle the checkbox state
    progress[round][index] = !progress[round][index];
    
    if (progress[round][index]) {
      // If checked, upsert the state in Supabase
      const { error } = await supabase
        .from('goaltracker')
        .upsert({ 
          goal_id: goal_id, // Add goal_id
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
      // If unchecked, delete the record from Supabase
      const { error } = await supabase
        .from('goaltracker')
        .delete()
        .match({ 
          goal_id: goal_id, // Match goal_id
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

  // Run fetchGoalData to load goal_id and then fetchProgressData on page load
  fetchGoalData();
</script>

<main class="main">
  <h1 class="title">
    <span class="underline decoration-wavy decoration-emerald-400">{goal}</span> {totalRounds}회독
  </h1>
  
  <div class="flex flex-col gap-2 px-4">
    {#each Array(totalRounds) as _, round}
      <Card.Root class="custom-card">
        <Card.Header>
          <Card.Title>{round + 1}회독</Card.Title>
          <Card.Description>진도 체크</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="checkboxes">
            {#each Array(totalCheckBoxes) as _, index}
              <button
                class="custom-checkbox {progress[round][index] ? 'checked' : ''}"
                style="background-color: {progress[round][index] ? roundColors[round] : 'white'}; color: {progress[round][index] ? 'white' : 'gray'};"
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
</main>

<style>
  .main {
    font-family: KyoboHand;
  }
  .title {
    text-align: center;
    font-size: x-large;
    margin: 24px;
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
</style>