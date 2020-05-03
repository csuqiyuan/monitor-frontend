<template>
    <div id="pro_form" style="position: relative;width: 100%;height: 1000px;">
        <div style="position: relative;width: auto">
            <el-row>
                <el-col :span="5" v-for="node in nodes" :key="node.name" :offset="1">
                    <el-card @click.native="toNode(node.name)" shadow="hover" style="width: 260px;height: 250px;">
                        <div class="title">
                            <span>{{node.name}}</span>
                        </div>
                        <div class="div-hr"></div>
                        <ul>
                            <li>
                                ip: {{node.ip}}
                            </li>
                            <li>
                                test: {{node.test}}
                            </li>
                        </ul>

                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>

</template>

<script>
	export default {
		name: "Nodes",
		data() {
			return {
				currentDate: 1000000,
				nodes: [
					{
						"ip": "110.120.119.20",
						"name": "master",
						"test": "aaa"
					},
					{
						"ip": "110.120.119.21",
						"name": "node1",
						"test": "11223"
					},
					{
						"ip": "110.120.119.21",
						"name": "node2",
						"test": "11223"
					},
					{
						"ip": "110.120.119.21",
						"name": "node3",
						"test": "11223"
					},
					{
						"ip": "110.120.119.21",
						"name": "node4",
						"test": "11223"
					}
				]
			}
		},
		methods: {
			toNode(hostname){
				console.log(hostname)
				this.$router.push({ path: 'node', query: { hostname: hostname }})
            }
		}
	}
</script>

<style scoped>
    ul li {
        list-style-type: none;
        text-align: left;
    }
    .title{
        margin: 10px 0;
        line-height: 20px;
    }
    .title span{
        font-weight: bold;
        font-size: 20px;
    }
    .div-hr{
        height: 1px;
        width: 90%;
        margin: 0 auto;
        background-color: #409EFF;
    }

    .box-card {
        width: 480px;
    }
</style>