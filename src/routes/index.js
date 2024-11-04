import Home from '~/routes/Home.svelte'
import GoalCheck from '~/routes/GoalCheck.svelte'

export default {
    '/': Home,
    '/check/:goal': GoalCheck, // 파라미터가 있는 페이지
}