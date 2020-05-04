<template>
    <div style="padding-top: 1px;">
        <div class="info">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="名称"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="镜像"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="申请CPU资源"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="申请Memory资源"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="最大CPU资源"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="最大Memory资源"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="创建时间"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="存活时间"
                        width="120">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
	export default {
		name: "Deployments"
	}
</script>

<style scoped>
    .info {
        width: 90%;
        margin: 20px auto 0;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        padding-top: 1px;
        padding-bottom: 1px;
    }
</style>