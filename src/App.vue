<template>
    <div id="app" class="all-size">
        <el-container class="all-height" direction="vertical">
            <Header></Header>
            <el-container>
                <Aside></Aside>
                <MainPage></MainPage>
            </el-container>
        </el-container>

    </div>
</template>

<script>

	import Aside from "./common/Aside";
	import MainPage from "./common/MainPage";
	import Header from "./common/Header";

	export default {
		name: 'App',
		components: {
			Header,
			Aside,
			MainPage

		}
	}
</script>

<style>
    html,body{
        height: 100%;
        width: 100%;
    }
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
