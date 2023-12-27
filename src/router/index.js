import {createRouter, createWebHistory} from 'vue-router'
// import { onAuthStateChanged } from "firebase/auth"
// import {auth} from '../firebase.js'
// import {ref} from 'vue'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

// const loggedInUser = ref(null)
// onAuthStateChanged(auth, (user) => {
//     console.log(user)
//     console.log(loggedInUser.value)
//     if (user) {
//         loggedInUser.value = user
//     } else {
//       loggedInUser.value = null
//     }
// })

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
            name: 'Home',
        },
        {
            path: '/login',
            component: Login,
            name: 'Login',
        },
        {
            path: '/register',
            component: Register,
            name: 'Register'
        }
    ]
})

export default router