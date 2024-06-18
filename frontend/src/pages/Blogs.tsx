import { BlogCard } from "../components/BlogCard"
import { AppBar } from "../components/AppBar"
import { useBlogs } from "../hooks"

// store it in state
// store it directly here
// store it in context variables
// create custom hook called useBlogs
export const Blogs = () => {
    const {loading, blogs}: {loading: boolean, blogs: Blog[]} = useBlogs();
    
    if(loading){
        return <div>
            loading...
        </div>
    }
    
    
    return <div>

        <AppBar/>
        <div className="flex justify-center">
            <div className="max-w-xl">
                {blogs.map(blog=> <BlogCard
                    authorName={blog.author.name ||"Anonymous"}
                    title={blog.title}
                    content={"The world of Artificial Intelligence continues to fascinate us. We collected 7 free artificial intelligence(AI) tools, most of them easy to use and some more sophisticated… like building ML models. We did try to be unique and avoid many of the AI platforms you’ll find in most posts of Best AI Tools. Additionally, we wanted them to be free for testing, without caveats like adding your credit card number. Some of these we use ourselves (e.g., Lumen, JADBio), so it was important for us to include them as we truly value what they have to offer."}
                    publishedDate={"12 April 2024"}
                />)}
                
            </div>
        </div>
    </div>
}