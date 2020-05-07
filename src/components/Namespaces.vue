<template>
    <div style="padding-top: 1px;">
        <div class="info">
            <el-table
                    :data="namespaces"
                    style="width: 60%">
                <el-table-column
                        prop="metadata.name"
                        label="名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="status.phase"
                        label="状态"
                        width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status.phase==='Active'"
                              style="color:#67C23A;font-weight: bold;">{{scope.row.status.phase}}</span>
                        <span v-else style="color: #F56C6C;font-weight: bold;">{{scope.row.status.phase}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
	import {cluster, namespaces} from "../axios/apis";

	export default {
		name: "Namespaces",
        data(){
			return{
				namespaces:[]
            }
        },
        mounted() {
			namespaces(null).then(res=>{
				for (let i = 0; i < res.items.length; i++) {
					let d = new Date(res.items[i].metadata.creationTimestamp)
					res.items[i].createTime = d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1))
						+ "-" + (d.getDay() < 10 ? "0" + d.getDay() : d.getDay()) + " " + (d.getHours() < 10 ? "0" + d.getHours() : d.getHours())
						+ ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
				}
				this.namespaces = res.items
			})
		},
		created() {
			cluster(null).then(res => {
				console.log(res)
				if (res.message==null){
					this.$router.replace("/404")
				}
			})
		},
		methods:{
			handleClick(row) {
				console.log(row);
			},
        }
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