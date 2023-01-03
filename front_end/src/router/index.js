import { createRouter, createWebHistory } from 'vue-router'
import EmptyComponent from '../components/EmptyComponent.vue';
import ChatRoom from '../components/ChatRoom.vue';
import LoginComponent from '../components/LoginComponent.vue';
import PostList from '../components/PostList.vue';
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
        path: '/posts', component: PostList
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