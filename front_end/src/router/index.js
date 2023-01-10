import { createRouter, createWebHistory } from 'vue-router'
import EmptyComponent from '../components/EmptyComponent.vue';
import ChatRoom from '../components/ChatRoom.vue';
import LoginComponent from '../components/LoginComponent.vue';
import Home from '../components/Home.vue';
import CreatePost from '../components/CreatePost.vue';
import Profile from '../components/Profile.vue';
import ContactBook from '../components/ContactBook.vue';


const routes = [
    {
        path: '/', component: LoginComponent
    },
    {
        path: '/login', component: LoginComponent
    },
    {
        path: '/chat-room', component: ChatRoom
    },
    {
        path: '/home', component: Home
    },
    {
        path: '/create-post', component: CreatePost
    },
    {
        path: '/profile/:id', component: Profile
    },
    {
        path: '/contact-book', component: ContactBook
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router