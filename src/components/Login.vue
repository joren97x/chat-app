<script setup>

    import {ref, reactive} from 'vue'
    import { signInWithEmailAndPassword } from "firebase/auth"
    import {auth} from '../firebase.js'
    import {useRouter} from 'vue-router'

    const router = useRouter()
    const showPassword = ref(false)
    const loginForm = reactive({
        email: null,
        password: null,
    })

    function login() {
        signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
        .then((userCredential) => {
            router.push('/')
        })
        .catch((error) => {
            alert(error.message)
        });
    }

</script>

<template>
    <v-container fluid style="height: 100vh" class="bg-grey-lighten-3">
        <v-card title="Login" width="69%">
            <v-card-text>
                Don't have an account? <a href="/register">Register</a>
            </v-card-text>
            <v-card-item>
                <v-text-field label="Email" v-model="loginForm.email" ></v-text-field>
                <v-text-field v-model="loginForm.password" label="Password" :type="showPassword ? 'text' : 'password'">
                    <template v-slot:append-inner>
                        <v-btn v-if="loginForm.password" variant="text" :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click="showPassword = !showPassword"></v-btn>
                    </template>
                </v-text-field>
            </v-card-item>
            <v-card-actions>
                <v-btn @click="login">Login</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<style>

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

</style>