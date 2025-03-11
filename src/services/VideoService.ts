import {EntityManager} from "@mikro-orm/postgresql";
import {Video,User} from "../entities/index";
import {uploadMiddleware} from "../middlewares/upload";


export class VideoService {
    constructor(private readonly em: EntityManager) {
    }
    async createVideo({title,user,hashtag,files}: {title: string, user: User,hashtag:string,files:any}) {
    try{
        if(!files){
            throw new Error('No video found!');
        }
        const video = await this.em.persistAndFlush(this.em.create(Video, {
            user,
            title,
            videoUrl: files.video.fileUrl,
            hashtags: hashtag || '',
            thumbnailUrl: files.video.thumbnailUrl || null,
            duration: files.video.duration || 0
        }));
        return {
            success: true,
            video,
        };
    }catch(err){
        console.error(err);
    }
    }

}
