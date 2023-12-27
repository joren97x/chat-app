<script setup>

    import {reactive, ref, onMounted} from 'vue'
    import { onAuthStateChanged } from "firebase/auth"
    import {auth, db} from '../firebase.js'
    import {useRouter} from 'vue-router'
    import { collection, getDocs } from "firebase/firestore"

    const router = useRouter()
    const message = ref('')
    const people = ref([])
    const currentOpenedChat = ref(null)
    const loggedInUser = reactive({
        email: null,
        name: null
    })

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user)
            loggedInUser.email = user.email
            loggedInUser.id = user.id
            loggedInUser.name = user.displayName
        } else {
            router.push('/login')
        }
    })

    function logout() {
        router.push('/login')
    }

    onMounted(async() => {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            people.value.push({
                id: doc.id,
                ...doc.data(),
            })
            console.log(doc.data())
        })

    })

 
</script>

<template>
        <v-row>
            <v-col cols="4" class="bg-grey-darken-4" style="height: 100vh;">
                {{ loggedInUser }}
                <v-list-item>
                    <template v-slot:append>
                        <v-btn icon="mdi-square-edit-outline" variant="text"></v-btn>
                        <v-btn icon="mdi-menu" variant="text"></v-btn>
                    </template>
                    <p class="text-h6">Chats</p>
                </v-list-item>
                <v-divider class="my-5"/>
                <v-list-item 
                    class="rounded-lg pa-3 ms-2 bg-grey-lighten-2"
                    prepend-avatar="https://images.hellomagazine.com/horizon/43/69c9db9bd312-ryan-gosling-at-tag-event.jpg"
                    title="Ryan Gosling"
                    subtitle="Literally me."
                    >
                </v-list-item>
                <template v-for="person in people" :key="person.email">
                    <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                            <v-list-item
                                @click="currentOpenedChat = person"
                                v-bind="props"
                                :class="['rounded-lg', 'pa-3', 'ms-2', isHovering ? 'bg-grey-lighten-1' : '']"
                                prepend-avatar="https://tr.rbxcdn.com/84476f3ec772872f6e1c4751dea5bd2a/420/420/Image/Png"
                                :title="person.firstname + ' ' + person.lastname"
                                subtitle="Recent message"
                                >
                            </v-list-item>
                        </template>
                    </v-hover>
                </template>
                <div style="position: absolute; bottom: 0; width: 33%;">
                    <v-divider></v-divider>
                        <v-list-item 
                        class="mb-5" 
                        prepend-avatar="https://tr.rbxcdn.com/84476f3ec772872f6e1c4751dea5bd2a/420/420/Image/Png" 
                        :title="loggedInUser.name"
                        >
                            <template v-slot:subtitle>
                                <v-icon color="green">mdi-circle-medium</v-icon>Active now
                            </template>
                            <template v-slot:append>
                                <v-btn class="text-none" @click="logout" color="red" variant="text">Logout</v-btn>
                            </template>
                        </v-list-item>
                    </div>
            </v-col>
            <!-- chat box section -->
            <v-col cols="8" v-if="currentOpenedChat">
                <v-toolbar color="white">
                    <v-list-item 
                        prepend-avatar="https://images.hellomagazine.com/horizon/43/69c9db9bd312-ryan-gosling-at-tag-event.jpg"
                        :title="currentOpenedChat.firstname + ' ' + currentOpenedChat.lastname"
                        >
                        <template v-slot:subtitle>
                            <v-icon color="green">mdi-circle-medium</v-icon>Active now
                        </template>
                    </v-list-item>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-phone" variant="text"></v-btn>
                    <v-btn icon="mdi-video" variant="text"></v-btn>
                    <v-btn icon="mdi-dots-horizontal" variant="text"></v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <div style="height: 100;">
                    {{ currentOpenedChat }}
                    <div style="display: flex; align-items: center;">
                        <v-avatar>
                            <v-img cover src="https://images.hellomagazine.com/horizon/43/69c9db9bd312-ryan-gosling-at-tag-event.jpg">
                            </v-img>
                        </v-avatar>
                        <div class="bg-grey-lighten-2 pa-3 rounded-xl my-1 mx-3">
                            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam, vel? Lorem ipsum dolor sit amet.
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <v-avatar>
                            <v-img cover src="https://images.hellomagazine.com/horizon/43/69c9db9bd312-ryan-gosling-at-tag-event.jpg">
                            </v-img>
                        </v-avatar>
                        <div class="bg-grey-lighten-2 pa-3 rounded-xl my-1 mx-3">
                            Lorem ipsum dolg elit. Laboriosam, vel? Lorem ipsum dolor sit amet.
                        </div>
                    </div>
                    <v-row justify="end">
                        <div class="bg-blue-lighten-4 pa-3 rounded-xl my-1 mx-3">
                            Literally me.
                        </div>
                        <v-avatar class="mt-2 me-5">
                            <v-img cover src="https://images.hellomagazine.com/horizon/43/69c9db9bd312-ryan-gosling-at-tag-event.jpg"></v-img>
                        </v-avatar>
                    </v-row>
                    <!-- <v-row justify="end">
                        <div class="bg-blue-lighten-4 pa-3 rounded-xl my-1 mx-3">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore ratione molestias vel voluptas dolorum unde iusto minima numquam maxime doloremque?
                        </div>
                        <v-avatar class="mt-2 me-5">
                            <v-img cover src="https://images.hellomagazine.com/horizon/43/69c9db9bd312-ryan-gosling-at-tag-event.jpg"></v-img>
                        </v-avatar>
                    </v-row> -->
                    <div style="position: absolute; bottom: 0; width: 65%;">
                        <v-text-field variant="outlined" label="Write a message" v-model="message">
                            <template v-slot:append-inner>
                                <v-fade-transition>
                                    <v-btn icon="mdi-send" v-if="message" variant="text"></v-btn>
                                </v-fade-transition>
                            </template>
                        </v-text-field>
                    </div>
                </div>
            </v-col>
        </v-row>
</template>