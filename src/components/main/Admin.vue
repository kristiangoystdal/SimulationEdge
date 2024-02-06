<template>
    <TitleVue :title='pageTitle'></TitleVue>

    <v-card id=content>
        <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
            <v-tab :value="one">Users</v-tab>
            <v-tab :value="two">Actions</v-tab>
            <v-tab :value="three">Abstract</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item value="one">
                <div v-if="loading">Loading users...</div>
                <div v-else>
                    <v-data-table :items="items"></v-data-table>
                </div>

            </v-window-item>
            <v-window-item value="two">
                Two
            </v-window-item>
            <v-window-item value="three">
                Three
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script>
import TitleVue from '../extra/Title.vue';
import { getDatabase, get, ref, onValue } from 'firebase/database';


export default {
    name: 'Admin',
    data() {
        return {
            pageTitle: "Admin Page",
            tab: null,
            users: {},
            loading: true,
        };
    },
    components: {
        TitleVue
    },
    methods: {
        async fetchUsers() {
            const db = getDatabase();
            const usersRef = ref(db, 'users');
            onValue(usersRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    // Clear the items array before adding new user IDs and usernames
                    this.items = [];

                    for (const userId of Object.keys(users)) {
                        // Assuming 'username' database location holds usernames keyed by userId
                        const usernameRef = ref(db, `username/${userId}`);
                        const usernameSnapshot = await get(usernameRef);

                        if (usernameSnapshot.exists()) {
                            const username = usernameSnapshot.val();
                            this.items.push({
                                userID: userId,
                                username: username,
                            });
                        } else {
                            console.log(`No username found for userID: ${userId}`);
                            // Optionally handle users without a username
                            // For example, push with a placeholder username
                            this.items.push({
                                userID: userId,
                                username: "Unknown", // Placeholder for missing usernames
                            });
                        }
                    }

                    // This log might execute before all usernames are fetched due to async nature
                    console.log('Items:', this.items);
                    this.loading = false
                } else {
                    console.log("No user data available");
                }
            }, (error) => {
                console.error(error);
            });
        }

    },
    mounted() {
        this.fetchUsers();
    },
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

#content {
    max-width: 90%;
    width: 1200px;
    margin: 2vw auto;
}

@media (min-width: 769px) {}

@media (max-width: 768px) {}
</style>
