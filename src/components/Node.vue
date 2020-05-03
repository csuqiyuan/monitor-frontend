<template>
    <div style="padding-top: 1px">
        <span style="font-size: 22px;font-weight: bold;">{{this.$route.query.hostname}}</span>
        <div class="info">
            <p class="title">基本信息：</p>
            <ul>
                <li>
                    ip: {{node.ip}}
                </li>
                <li>
                    ip: {{node.name}}
                </li>
                <li>
                    ip: {{node.test}}
                </li>
            </ul>
        </div>

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
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="申请Memory资源">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="最大CPU资源"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="最大Memory资源">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
	export default {
		name: "Node",
		data() {
			return {
				node: {
					"ip": "110.120.119.21",
					"name": "node1",
					"test": "11223"
				},
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}]
			}
		},
		methods: {
			handleClick(row) {
				console.log(row);
			}
		}
	}
</script>

<style scoped>
    ul li {
        list-style-type: none;
        text-align: left;
        font-size: 18px;
        line-height: 30px;
    }

    .info {
        width: 90%;
        margin: 20px auto 0;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        padding-top: 1px;
        padding-bottom: 1px;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        line-height: 30px;
        text-align: left;
        margin: 10px 20px 0;
    }
</style>