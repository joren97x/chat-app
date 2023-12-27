<script setup>

    import {reactive, ref, onMounted, watch} from 'vue'
    import { onAuthStateChanged } from "firebase/auth"
    import {auth, db} from '../firebase.js'
    import {useRouter} from 'vue-router'
    import { collection, getDocs, query, where, addDoc, doc, getDoc } from "firebase/firestore"

    const router = useRouter()
    const message = ref('')
    const people = ref([])
    const recentChats = ref([])
    const currentOpenedChat = ref(null)
    const messageTab = ref(true)
    const loggedInUser = reactive({
        email: null,
        firstname: null,
        lastname: null,
        id: null
    })

    onAuthStateChanged(auth, async(user) => {
        if (user) {
            const q = query(collection(db, "users"), where("email", "==", user.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                loggedInUser.email = doc.data().email
                loggedInUser.id = doc.id
                loggedInUser.firstname = doc.data().firstname
                loggedInUser.lastname = doc.data().lastname
            });
        } else {
            router.push('/login')
        }
    })

    function logout() {
        router.push('/login')
    }

    watch(loggedInUser, async () => {
        const recentChatSnapshot = await getDocs(
            query(collection(db, "conversations"), where("sender_id", "==", loggedInUser.id))
        );
            recentChatSnapshot.forEach(async(docu) => {
                const userRef = doc(db, "users", docu.data().receiver_id)
                const userSnap = await getDoc(userRef)
                console.log(userSnap.data())
                
                recentChats.value.push({
                    id: docu.id,
                    ...userSnap.data(),
                    ...docu.data(),
                })
            })
    })

    onMounted(async() => {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            people.value.push({
                id: doc.id,
                ...doc.data(),
            })
        })

        // const recentChatSnapshot = await getDocs(collection(db, "conversations"))
        
        })

    async function sendMessage(receiver_id) {
        try {
            // Check if a conversation already exists for the given participants
            // const querySnapshot = await getDocs(collection(db, "conversations", "message"))

            // console.log(querySnapshot)
            const querySnapshot = await getDocs(
                query(collection(db, "conversations"), where("sender_id", "==", loggedInUser.id), where("receiver_id", "==", receiver_id))
            );
        // const querySnapshot = await getDocs(
        //     query(collection(db, "conversations"), where("sender_id", "array-contains", loggedInUser.id))
        // );
            let conversation;
            if (querySnapshot.docs.length > 0) {
                // If conversation exists, use the first one (you might want to handle multiple conversations differently)
                conversation = querySnapshot.docs[0];
            } else {
                // If conversation doesn't exist, create a new one
                conversation = await addDoc(collection(db, "conversations"), {
                    sender_id: loggedInUser.id,
                    receiver_id: receiver_id
                });
            }

            const conversation_id = conversation.id;

            // Add a new message to the existing conversation
            await addDoc(collection(db, "conversations", conversation_id, "messages"), {
                sender_id: loggedInUser.id,
                receiver_id: receiver_id,
                message: message.value,
                timestamp: new Date(),
            });

            alert('Message sent!');
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    async function fetchMessage(chat) {
        currentOpenedChat.value = chat
        // console.log(chat.id)
        // const chatRef = doc(db, "conversations", chat.id)
        // const chatSnap = await getDoc(chatRef)
        // console.log(chatSnap.data())
        try {
            const chatSnap = await getDocs(collection(db, "conversations", chat.id, "messages"))
            chatSnap.forEach((doc) => {
                console.log(doc.data())
            })
        }
        catch(error) {
            console.log(error)
        }
    }

 
</script>

<template>
    <v-navigation-drawer theme="dark" rail permanent>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-chat" @click="messageTab = true" value="dashboard"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" @click="messageTab = false" value="messages"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-row>
        <v-col cols="4" class="bg-grey-darken-4" style="height: 100vh;" v-if="messageTab">
            <v-list-item>
                <template v-slot:append>
                    <v-btn icon="mdi-square-edit-outline" variant="text"></v-btn>
                    <v-btn icon="mdi-menu" variant="text"></v-btn>
                </template>
                <p class="text-h6">Chats</p>
            </v-list-item>
            <v-text-field variant="outlined" density="compact" prepend-inner-icon="mdi-magnify" label="Search..." class="mx-4"></v-text-field>
            <template v-for="chat in recentChats" :key="chat.id">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <v-list-item
                            @click="fetchMessage(chat)"
                            v-bind="props"
                            :class="['rounded-lg', 'pa-3', 'ms-2', isHovering ? 'bg-grey-lighten-1' : '', currentOpenedChat?.email == chat.email ? 'bg-grey-lighten-1' : '']"
                            prepend-avatar="https://tr.rbxcdn.com/84476f3ec772872f6e1c4751dea5bd2a/420/420/Image/Png"
                            :title="chat.firstname + ' ' + chat.lastname"
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
                    :title="loggedInUser.firstname + ' ' + loggedInUser.lastname"
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
        <v-col cols="4" class="bg-grey-darken-4" style="height: 100vh;" v-else>
            <v-list-item>
                <p class="text-h6">People</p>
            </v-list-item>
            <p class="text-caption ms-4 mb-4"> Registered users </p>
            <!-- <v-list-item 
                class="rounded-lg pa-3 ms-2"
                prepend-avatar="https://images.hellomagazine.com/horizon/43/69c9db9bd312-ryan-gosling-at-tag-event.jpg"
                title="Ryan Gosling"
                subtitle="Literally me."
                >
            </v-list-item> -->
            <template v-for="person in people" :key="person.email">
                <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                        <v-list-item
                            @click="currentOpenedChat = person"
                            v-bind="props"
                            :class="['rounded-lg', 'pa-3', 'ms-2', isHovering ? 'bg-grey-lighten-1' : '', currentOpenedChat?.email == person.email ? 'bg-grey-lighten-1' : '']"
                            prepend-avatar="https://tr.rbxcdn.com/84476f3ec772872f6e1c4751dea5bd2a/420/420/Image/Png"
                            :title="person.firstname + ' ' + person.lastname"
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
                    :title="loggedInUser.firstname + ' ' + loggedInUser.lastname"
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
                <div style="position: absolute; bottom: 0; width: 63%;">
                    <v-form @submit.prevent="sendMessage(currentOpenedChat.id)">
                        <v-text-field variant="outlined" label="Aa" v-model="message">
                            <template v-slot:append-inner>
                                <v-fade-transition>
                                    <v-btn icon="mdi-send" v-if="message" variant="text"></v-btn>
                                </v-fade-transition>
                            </template>
                        </v-text-field>
                    </v-form>
                </div>
            </div>
        </v-col>
    </v-row>
</template>