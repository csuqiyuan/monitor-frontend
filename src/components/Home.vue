<template>

    <div class="all-size">
        <el-row type="flex" justify="space-around">
            <el-col :span="cardWidth">
                <router-link to="/nodes">
                    <el-card shadow="hover">
                        <div>
                            <span>Nodes</span>
                            <br>
                            <span class="data">3</span>
                        </div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="cardWidth">
                <router-link to="/namespaces">
                    <el-card shadow="hover">
                        <div>
                            <span>Namespaces</span>
                            <br>
                            <span class="data">3</span>
                        </div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="cardWidth">
                <router-link to="/deployments">
                    <el-card shadow="hover">
                        <div>
                            <span>Deployments</span>
                            <br>
                            <span class="data">3</span>
                        </div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="cardWidth">
                <router-link to="/services">
                    <el-card shadow="hover">
                        <div>
                            <span>Services</span>
                            <br>
                            <span class="data">3</span>
                        </div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="cardWidth">
                <router-link to="/pods">
                    <el-card shadow="hover">
                        <div>
                            <span>Pods</span>
                            <br>
                            <span class="data">3</span>
                        </div>
                    </el-card>
                </router-link>
            </el-col>
        </el-row>
        <div style="margin: 0 auto;">
            <div id="main1" class="box"></div>
        </div>
    </div>

</template>

<!--机器数量、总cpu、总内存、总共已用cpu、总共已用内存、pod分布-->
<script>
	export default {
		name: "Home",
		data() {
			return {
				cardWidth: 4,
				cardGutter: 25,
			}
		},
		methods: {
			drawChart() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById("main1"));
				// 指定图表的配置项和数据

				let option = {
					title: [
						{
							text: '资源总揽',
                            left:'50%',
							textAlign: 'center'
						},
						{
							subtext: 'CPU使用情况',
							left: '30%',
							top: '90%',
							textAlign: 'center'
						},
						{
							subtext: 'Memory使用情况',
							right: '25%',
							top: '90%',
							textAlign: 'center'
						}
					],
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: '10%',
						top: '10%',
						data: ['剩余可用', '已经使用']
					},
					series: [
						{
							name:'CPU',
							type: 'pie',
							radius: '70%',
							right: "35%",
							center: ['50%', '50%'],
							data: [
								{value: 200, name: '剩余可用'},
								{value: 310, name: '已经使用'}
							],
							color: ['#67C23A', '#909399'],
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						},
						{
							name:'Memory',
							type: 'pie',
							radius: '70%',
							left: '35%',
							center: ['50%', '50%'],
							data: [
								{value: 335, name: '剩余可用'},
								{value: 310, name: '已经使用'}
							],
							color: ['#67C23A', '#909399'],
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							label: {
								show: false
							},
							labelLine: {
								show: false
							}
						}
					]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			}
		},
		mounted() {
			this.drawChart();
		}
	}
</script>

<style scoped>
    a {
        text-decoration: none;
        line-height: 25px;
        font-size: 20px;
        font-family: "Gill Sans", sans-serif;
        color: #606266;
    }

    a:hover span {
        font-size: 20px;
        font-weight: bold;
        color: #409EFF;
    }

    .data {
        font-size: 20px;
    }

    .box {
        height: 500px;
        width: 100%;
        margin: 100px auto 0;
    }
</style>