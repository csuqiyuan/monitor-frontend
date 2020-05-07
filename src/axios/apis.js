import {get, post} from "./index";

export const getCluster = p => post("/apis/cluster", p)
export const exitCluster = p => get("/apis/exit", p)

export const cluster = p => get("/apis/cluster", p)
export const resourcesNums = p => get("/common/resources/nums", p)
export const nodes = p => get("/apis/nodes", p)
export const node = (name, p) => get("/apis/node/" + name, p)
export const podsByNode = (hostname, p) => get("/apis/node/" + hostname + "/pods", p)
export const allPods = p => get("/apis/pods", p)
export const namespacedPods = (namespace, p) => get("/apis/" + namespace + "/pods", p)
export const namespaces = p => get("/apis/namespaces", p)
export const deploymentsForAllNamespaces = p => get("/apis/deployments", p)
export const namespacedDeployments = (namespace, p) => get("/apis/" + namespace + "/deployments", p)
export const services = p => get("/apis/services", p)
export const namespacedServices = (namespace, p) => get("/apis/" + namespace + "/services", p)