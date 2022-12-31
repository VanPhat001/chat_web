import { createRouter, createWebHistory } from 'vue-router'
import EmptyComponent from '../components/EmptyComponent.vue';
import ChatRoom from '../components/ChatRoom.vue';
import LoginComponent from '../components/LoginComponent.vue';
import PostsComponent from '../components/PostsComponent.vue';
import CreatePost from '../components/CreatePost.vue';


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
        path: '/posts', component: PostsComponent
    },
    {
        path: '/create-post', component: CreatePost
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router