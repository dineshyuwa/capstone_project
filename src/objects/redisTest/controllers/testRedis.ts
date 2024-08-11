import { Request, Response, NextFunction } from 'express';
import { redisService } from '../../redis/redis.service';

const get = async(req: Request, res: Response, next: NextFunction) => {
    console.log('fetching from redis...');
    const data = await redisService.get(req.params.keyName);
    return res.status(200).json({
        message: "Data fetched from redis",
        data: data ? JSON.parse(data) : null,
    });
};

const add = async(req: Request, res: Response, next: NextFunction) => {
    console.log('adding to redis...');
    await redisService.set(req.params.keyName, JSON.stringify(req.body));
    const data = await redisService.get(req.params.keyName);
    return res.status(200).json({
        message: "Data stored in redis",
        data
    });
};

const update = async(req: Request, res: Response, next: NextFunction) => {
    console.log('updating redis...');
    await redisService.set(req.params.keyName, JSON.stringify(req.body));
    const data = await redisService.get(req.params.keyName);
    return res.status(200).json({
        message: "Data updated in redis",
        data
    });
};

const remove = async(req: Request, res: Response, next: NextFunction) => {
    console.log('deleting from redis...');
    await redisService.delete(req.params.keyName);
    return res.status(200).json({ message: `Deleted ${req.params.keyName} in redis` });
};

export { get, add, update, remove };
