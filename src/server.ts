import app from "./app"
import config from "./app/config"

const main = async()=>{
    try{
        const server = app.listen(config.PORT,()=>{
            console.log('Server listening on port: ',config.PORT)
        })
    }catch(err){
        console.log(err)
    }
}
main()