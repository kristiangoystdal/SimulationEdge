<template>
    <div>
        <slot name="user" v-bind:user="user"></slot>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { auth } from 'firebase';



    export default{
        name:"UserComp", 
        setup(){
            const user = ref(null);
            const unsubscribe = auth.onAuthStateChanged(
                firebaseUser => user.value = firebaseUser
            );

            return{
                user,
                unsubscribe
            }
        }
    }


</script>