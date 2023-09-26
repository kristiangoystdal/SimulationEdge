<template>
    <VariableStore></VariableStore>
    <FormulaSelector></FormulaSelector>
    <!-- <DevelopmentComp></DevelopmentComp> -->
</template>
    
<script>
    // import DevelopmentComp from '../../components/DevelopmentComp.vue'
    import FormulaSelector from '../../components/FormulaSelector.vue'
    import VariableStore from '../../components/VariableStore.vue'

    export default{
        name: "AlphabetGamePage", 
        components: {
            // DevelopmentComp, 
            VariableStore, 
            FormulaSelector,
        }
    }
</script>
    
<style scoped>

</style>
    