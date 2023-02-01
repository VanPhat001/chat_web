import { createRouter, createWebHistory } from 'vue-router'
// import .. from .. emptypage

const routes = [
    {
        path: '/',
        // component: () => import('../components/LoginComponent.vue'),
        component: () => import('../components/LoaddingComponent.vue'),
    },
    {
        path: '/login',
        component: () => import('../components/LoginComponent.vue'),
        name: 'login'
    },
    {
        path: '/chat-room',
        component: () => import('../components/ChatRoom.vue'),
        name: 'chat-room'
    },
    {
        path: '/home',
        component: () => import('../components/Home.vue'),
        name: 'home'
    },
    {
        path: '/create-post',
        component: () => import('../components/CreatePost.vue'),
        name: 'create-post'
    },
    {
        path: '/profile/:id',
        component: () => import('../components/Profile.vue'),
        name: 'profile'
    },
    {
        path: '/edit-profile',
        component: () => import('../components/EditProfile.vue'),
        name: 'edit-profile'
    },
    {
        path: '/contact-book',
        component: () => import('../components/ContactBook.vue'),
        name: 'contact-book',
        children: [
            {
                path: 'suggest',
                component: () => import('../components/SuggestFriends.vue'),
                name: 'suggest'
            },
            {
                path: 'request',
                component: () => import('../components/FriendRequests.vue'),
                name: 'request'
            },
            {
                path: 'friends',
                component: () => import('../components/FriendList.vue'),
                name: 'friends'
            }
        ]
    },
    {
        path: '/post/:id',
        name: 'post',
        component: () => import('../components/PostSingle.vue')
    },
    {
        path: '/test',
        component: () => import('../components/FriendChatList.vue'),
        props: {
            pFriendsChatId: [],
            pLastMessages: [],
            pNotifyNumber: [],
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router