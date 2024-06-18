import { Avatar } from "./BlogCard"

export const AppBar = () =>{
    return <div className="border-b flex justify-between px-10 py-4">
        <div className="flex flex-col flex justify-center">
            Medium
        </div>
        <div>
            <Avatar size="big" name="Darren"/>
        </div>
    </div>
        

}