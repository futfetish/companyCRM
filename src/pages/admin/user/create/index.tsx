import { UserCreateCard } from "~/shared/user/createCard";
import { cn } from "~/shared/utils";

export default  function CreateUser(){
    return <div className={cn( 'w-[100svw]' , 'h-[100svh]' , 'flex' , 'items-center' , 'justify-center')} >
        <UserCreateCard />
    </div>
}