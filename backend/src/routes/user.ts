import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify, sign} from 'hono/jwt'
import { Bindings } from 'hono/types';
import { signupInput, signinInput } from '@darren_chahal/medium-common';

export const userRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string;
            JWT_SECRET: string;
        };
    }
>();

userRouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

  const body = await c.req.json();
  const {success} = signinInput.safeParse(body)
  if(!success){
    c.status(411)
    return c.json({error: "invalid input"})
  }

	try{
    
	  const user = await prisma.user.findUnique({
		where: {
			email: body.username,
      password: body.password,
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}
  // @ts-ignore
	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
  }
  catch(e){
    console.log(e);
    c.status(411);
    return c.text("Invalid" )
  }
})


userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json();
  const {success} = signupInput.safeParse(body)
  if(!success){
    c.status(411)
    console.log(success)
    return c.json({error: "invalid input"})
  }
  try{
    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: body.password,  
      },
    })

    // @ts-ignore
    const token = await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({
      jwt: token
    })



  }
  catch(e){
    c.status(411)
    return c.json({error: "user already exists"})
  }
  
  
})