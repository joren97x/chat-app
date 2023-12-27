<script setup>

    import {ref, reactive} from 'vue'
    import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
    import { collection, addDoc } from "firebase/firestore"
    import {db} from '../firebase.js'
    import {auth} from '../firebase.js'
    import {useRouter} from 'vue-router'

    const router = useRouter()
    const showPassword = ref(false)
    const registerForm = reactive({
        email: null,
        password: null,
        firstname: null,
        lastname: null
    })

    async function register() {
        createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password)
        .then((userCredential) => {
            addDoc(collection(db, "users"), {
                firstname: registerForm.firstname,
                lastname: registerForm.lastname,
                email: registerForm.email,
                password: registerForm.password,
            })
            const user = userCredential.user
            updateProfile(auth.currentUser, { displayName: registerForm.firstname + " " + registerForm.lastname}).then(() => {
                // Profile updated!
            }).catch((error) => {
                // An error occurred
            })
            alert('success?')
            router.push('/login')
        })
        .catch((error) => {
            alert(error.message)
        })
    }

</script>

<template>
    <v-container fluid style="height: 100vh" class="bg-grey-lighten-3">
        <v-card title="Register" width="69%">
            <v-card-item>
                <v-row>
                    <v-col cols="6">
                        <v-text-field label="First name" v-model="registerForm.firstname"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="Last name" v-model="registerForm.lastname"></v-text-field>
                    </v-col>
                </v-row>
                <v-text-field label="Email" v-model="registerForm.email"></v-text-field>
                <v-text-field label="Password" :type="showPassword ? 'text' : 'password'" v-model="registerForm.password">
                    <template v-slot:append-inner>
                        <v-btn v-if="registerForm.password" variant="text" :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click="showPassword = !showPassword"></v-btn>
                    </template>
                </v-text-field>
            </v-card-item>
            <v-card-actions>
                <v-btn @click="register">Register</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>