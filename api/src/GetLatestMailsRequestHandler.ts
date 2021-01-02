import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';

import DbConnector from "./DbConnector"

export default class GetLatestMailsRequestHandler {

    private dbConnector: DbConnector
    static readonly defaultCount = 50;

    private constructor( dbConnector: DbConnector ) {
        this.dbConnector = dbConnector;
    }

    private handleRequest(req: Request, res: Response, next: NextFunction) {
        const queryCount = req.query.count;
  
        this.dbConnector.getLatestMails(queryCount ? parseInt(queryCount.toString()) : GetLatestMailsRequestHandler.defaultCount )
          .then(mails => {
            res.status(200).send(mails);
          })
          .catch(next);
    }

    static create(dbConnector: DbConnector): (req: Request, res: Response, next: NextFunction) => void {
        const returned = new GetLatestMailsRequestHandler( dbConnector );
        return returned.handleRequest.bind(returned);
    }
}