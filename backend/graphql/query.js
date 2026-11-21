import{
    getPostById,
    listAllPosts,
    listPostsByAuthor,
    listPostsByTag,
}from '../src/services/posts.js'



export const querySchema=`#graphql
            input PostOptions{
            sortBy:String
            sortOrder:String
            }


            type Query{
                test:String
                posts(options:PostOptions):[Post!]!
                postByAuthor(username:String!,options:PostOptions):[Post!]!
                postByTag(tag:String!,options:PostOptions):[Post!]!
                postById(id:ID!):Post
            }
                `
export const queryResolver={
    Query:{
        test:()=>{
            return 'Hello World from GraphQl'
        },
        posts:async(parent,{options})=>{
            return await listAllPosts(options)
        },
        postByAuthor:async (parent,{username,options})=>{
            return await listPostsByAuthor(username,options)
        },
        postByTag:async(parent,{tag,options})=>{
            return await listPostsByTag(tag,options)
        },
        postById: async (parent,{id})=>{
            return await getPostById(id)
        },


    },
}