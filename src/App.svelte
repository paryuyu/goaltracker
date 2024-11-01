<script>
  import * as Card from "$lib/components/ui/card";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { supabase } from '$lib/supabaseClient';

  const goal = "Grammar in Use";  
  const totalCheckBoxes = 113;
  const totalRounds = 10;

  // Initialize progress array
  let progress = Array(totalRounds).fill(0).map(() => Array(totalCheckBoxes).fill(false));

  // Fetch data from Supabase
  async function fetchProgressData() {
    let { data: goaltracker, error } = await supabase
      .from('goaltracker')
      .select('*');
    if (error) {
      console.error('Error fetching data:', error);
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
    
    // Upsert (insert or update) the state in Supabase
    const { error } = await supabase
      .from('goaltracker')
      .upsert({ 
        round: round + 1, 
        unit: index + 1, 
        isChecked: progress[round][index] // Make sure to use the correct casing for the column name
      });

    if (error) {
      console.error('Error updating data:', error);
    } else {
      console.log(`Updated round ${round + 1}, unit ${index + 1}: ${progress[round][index]}`);
    }
  }

  // Run fetchProgressData to load the initial state on page load
  fetchProgressData();
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
    color: gray;
    background-color: white;
    border: 1px solid gray;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .custom-checkbox.checked {
    background-color: #34d399;
    color: white;
    font-weight: 800;
  }
</style>