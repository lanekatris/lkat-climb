import {Request,Response} from 'express'

exports.helloGET = (req:Request, res:Response) => {
    res.send('Hello World this is where we will call rhinofit ok?');
};
