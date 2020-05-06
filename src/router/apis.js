import {get} from "../axios";

export const cluster = p => get("/apis/cluster", p)
export const resourcesNums = p => get("/common/resources/nums", p)
export const nodes = p => get("/apis/nodes", p)
export const node = (name,p) => get("/apis/node/"+name,p)
export const podsByNode = (hostname,p)=> get("/apis/node/"+hostname+"/pods",p)
export const namespaces = p => get("/apis/namespaces",p)