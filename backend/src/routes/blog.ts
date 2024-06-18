import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify, sign} from 'hono/jwt'
import { Bindings } from 'hono/types';
import { createBlogInput, updateBlogInput } from '@darren_chahal/medium-common';

export const blogRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string;
            JWT_SECRET: string;
        };
        Variables: {
            userId: string;
        
        };
    }
>();


blogRouter.use('/*', async (c, next) =>{
    //get the header
    //verify the header
    // if header correct we can proced
    // if not correct we can return 403
    // extract user id
    // pass it doen to the router
    const header = c.req.header("authorization") || ""
    // Bearer token
    // const token = header.split(" ")[1]

    try{
        const response = await verify(header, c.env.JWT_SECRET)

        if(response){
            c.set("userId", response.id);
            await next()
        }
        else{
        c.status(403)
        return c.json({error: "unauthorized"})
        }
    }
    catch(e){
        c.status(403)
        return c.json({error: "unauthorized"})
    }
    
    
    

    
})

// Todo: add pagination 
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });
    return c.json({
        blogs
    
    })

})



blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())

    try{
        const blog = await prisma.blog.findFirst({
            where:{
                id: id
            }
            
        })
    
        return c.json({
            blog
        })
    }
    catch(e){
        c.status(411);
        return c.json({
            message:"Error while fetching blog post"
        })
    
    }
})





blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({error: "invalid input"})
    }
    
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())

    const userId = c.get("userId");
    const blog = await prisma.blog.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: userId

        }
        
    })

    return c.json({
        id: blog.id,
    })

})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({error: "invalid input"})
    }
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())

    const blog = await prisma.blog.update({
        
        where: {
            id: body.id
        },
        data:{
            title: body.title,
            content: body.content

        }
        
    })

    return c.json({
        id: blog.id,
    })




})