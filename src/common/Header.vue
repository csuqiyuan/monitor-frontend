<template>
    <el-header style="height: 50px; background-color: #409EFF">
        <div class="header-left">
            <router-link to="/"><span style="text-decoration: none">管理系统</span></router-link>
        </div>
        <div class="header-right">
            <el-dropdown @command="test">
                <span class="el-dropdown-link">
                    <i class="el-icon-more" style="color: #fff;font-size: 20px"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="/hello">添加集群</el-dropdown-item>
                    <el-dropdown-item>添加新节点</el-dropdown-item>
                    <el-dropdown-item>退出此集群</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

        </div>

    </el-header>
</template>

<script>
	export default {
		name: "Header",
		methods: {
			test(key) {
				console.log(key);
				this.$router.push(key);
			},
		}
	}
</script>

<style scoped>

    .header-left {
        display: inline;
        float: left;
        width: auto;
        padding-left: 20px;
        line-height: 50px;
        text-align: center;
        vertical-align: middle;
    }

    .header-left span {
        color: #fff;
        font-size: 20px;
    }

    .header-right {
        display: inline;
        vertical-align: middle;
        text-align: center;
        line-height: 50px;
        float: right;
        width: auto;
    }

    a {
        text-decoration: none;
        color: #409EFF;
    }

    .el-dropdown-link {
        cursor: pointer;
    }

</style>