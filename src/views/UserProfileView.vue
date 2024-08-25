<template>
  <div class="profile">
    <h1 v-if="currentUser">This is the user profile view page for user: {{currentUser.id}}</h1>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  beforeMount() {
    if (!this.currentUser) {
      this.$router.push('/');
    }
  }
};
</script>
