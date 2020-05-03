<template>
    <el-aside width="200px" class="all-height">
        <el-menu
                router
                default-active="/"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
            <el-menu-item index="/">
                <i class="el-icon-s-home"></i>
                <span slot="title">Home</span>
            </el-menu-item>
            <el-menu-item index="/nodes">
                <i class="el-icon-monitor"></i>
                <span slot="title">Nodes</span>
            </el-menu-item>
            <el-menu-item index="/namespaces">
                <i class="el-icon-document-copy"></i>
                <span slot="title">Namespaces</span>
            </el-menu-item>
            <el-menu-item index="/deployments">
                <i class="el-icon-s-management"></i>
                <span slot="title">Deployments</span>
            </el-menu-item>
            <el-menu-item index="/services">
                <i class="el-icon-share"></i>
                <span slot="title">Services</span>
            </el-menu-item>
            <el-menu-item index="5">
                <i class="el-icon-cpu"></i>
                <span slot="title">Pods</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script>
	export default {
		name: "aside",
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	}
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .el-menu-item {
        text-align: left;
        font-size: 16px;
        line-height: 60px;
        height: 60px;
    }

    .el-menu {
        border: 0;
    }
</style>