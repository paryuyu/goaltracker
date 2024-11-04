<!-- ~/App.svelte -->
<script>
  import Router from 'svelte-spa-router'
  import GoalCheck from './routes/GoalCheck.svelte';
  import Home from './routes/Home.svelte'
</script>

<Router routes={{
	'/': Home,
	'/:goal': GoalCheck,
}} />
